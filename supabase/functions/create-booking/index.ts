import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const allowedOrigins = new Set([
  "https://batumivelora.netlify.app",
  "http://localhost:5173",
]);

interface BookingRequest {
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  locale: "en" | "ka";
  specialRequests: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const stringValue = (record: Record<string, unknown>, key: string, maximum: number) => {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length > maximum) throw new Error(`Invalid ${key}`);
  return value.trim();
};
const integerValue = (record: Record<string, unknown>, key: string, minimum: number, maximum: number) => {
  const value = record[key];
  if (!Number.isInteger(value) || (value as number) < minimum || (value as number) > maximum) throw new Error(`Invalid ${key}`);
  return value as number;
};

const parseBody = (value: unknown): BookingRequest => {
  if (!isRecord(value)) throw new Error("Invalid request body");
  const roomTypeId = stringValue(value, "roomTypeId", 50);
  const checkIn = stringValue(value, "checkIn", 10);
  const checkOut = stringValue(value, "checkOut", 10);
  const firstName = stringValue(value, "firstName", 80);
  const lastName = stringValue(value, "lastName", 80);
  const email = stringValue(value, "email", 254).toLowerCase();
  const phone = stringValue(value, "phone", 40);
  const specialRequests = stringValue(value, "specialRequests", 1000);
  const locale = value.locale;

  if (!/^[0-9a-f-]{36}$/i.test(roomTypeId)) throw new Error("Invalid roomTypeId");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) throw new Error("Invalid stay dates");
  if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid guest details");
  if (locale !== "en" && locale !== "ka") throw new Error("Invalid locale");

  return {
    roomTypeId,
    checkIn,
    checkOut,
    adults: integerValue(value, "adults", 1, 20),
    children: integerValue(value, "children", 0, 20),
    firstName,
    lastName,
    email,
    phone,
    locale,
    specialRequests,
  };
};

const configuredKey = (indexName: string, fallbackName: string) => {
  const index = Deno.env.get(indexName);
  if (index) {
    const parsed: unknown = JSON.parse(index);
    if (isRecord(parsed) && typeof parsed.default === "string") {
      const key = Deno.env.get(parsed.default);
      if (key) return key;
    }
  }
  return Deno.env.get(fallbackName) ?? "";
};

const responseHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Vary": "Origin",
});

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin") ?? "";
  if (origin && !allowedOrigins.has(origin)) return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403 });
  const allowedOrigin = origin || "https://batumivelora.netlify.app";
  const headers = responseHeaders(allowedOrigin);

  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  if (Number(request.headers.get("content-length") ?? "0") > 16_384) return new Response(JSON.stringify({ error: "Request too large" }), { status: 413, headers });

  const publishableKey = configuredKey("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_ANON_KEY");
  if (!publishableKey || request.headers.get("apikey") !== publishableKey) return new Response(JSON.stringify({ error: "Invalid API key" }), { status: 401, headers });

  try {
    const input = parseBody(await request.json());
    const secretKey = configuredKey("SUPABASE_SECRET_KEYS", "SUPABASE_SERVICE_ROLE_KEY");
    const url = Deno.env.get("SUPABASE_URL") ?? "";
    if (!url || !secretKey) throw new Error("Booking service is not configured");

    const admin = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const paymentReference = `sim_${crypto.randomUUID()}`;
    const { data, error } = await admin.rpc("create_direct_booking", {
      p_room_type_id: input.roomTypeId,
      p_check_in: input.checkIn,
      p_check_out: input.checkOut,
      p_adults: input.adults,
      p_children: input.children,
      p_first_name: input.firstName,
      p_last_name: input.lastName,
      p_email: input.email,
      p_phone: input.phone,
      p_locale: input.locale,
      p_special_requests: input.specialRequests,
      p_payment_reference: paymentReference,
    });

    if (error) {
      const status = error.code === "P0001" ? 409 : error.code === "P0002" ? 404 : error.code === "22023" ? 422 : 500;
      return new Response(JSON.stringify({ error: status === 500 ? "Could not complete the reservation" : error.message }), { status, headers });
    }

    return new Response(JSON.stringify(data), { status: 201, headers });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Invalid booking request";
    const status = message === "Booking service is not configured" ? 500 : 400;
    return new Response(JSON.stringify({ error: status === 500 ? message : "Check the booking details and try again" }), { status, headers });
  }
});
