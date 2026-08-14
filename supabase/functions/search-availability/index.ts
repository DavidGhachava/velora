import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const allowedOrigins = new Set(["https://batumivelora.netlify.app", "http://localhost:5173"]);
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

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

const headersFor = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Vary": "Origin",
});

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin") ?? "";
  if (origin && !allowedOrigins.has(origin)) return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403 });
  const headers = headersFor(origin || "https://batumivelora.netlify.app");
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });

  const publishableKey = configuredKey("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_ANON_KEY");
  if (!publishableKey || request.headers.get("apikey") !== publishableKey) return new Response(JSON.stringify({ error: "Invalid API key" }), { status: 401, headers });

  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || typeof body.checkIn !== "string" || typeof body.checkOut !== "string" || !Number.isInteger(body.guests)) throw new Error("Invalid search");
    const secretKey = configuredKey("SUPABASE_SECRET_KEYS", "SUPABASE_SERVICE_ROLE_KEY");
    const url = Deno.env.get("SUPABASE_URL") ?? "";
    if (!url || !secretKey) throw new Error("Availability service is not configured");
    const admin = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await admin.rpc("search_available_room_types", {
      p_check_in: body.checkIn,
      p_check_out: body.checkOut,
      p_guests: body.guests,
    });
    if (error) return new Response(JSON.stringify({ error: error.code === "22023" ? error.message : "Could not search availability" }), { status: error.code === "22023" ? 422 : 500, headers });
    return new Response(JSON.stringify({ rooms: data }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ error: "Check the dates and guest count" }), { status: 400, headers });
  }
});
