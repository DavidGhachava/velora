# Velora Administrator Dashboard Plan

## 1. Product decision

Velora is an in-app booking platform, not a directory that sends guests to another website. One authenticated owner controls every public listing and every operational record from Velora's private dashboard. Supabase is the system of record for both the public site and the dashboard.

The first release has exactly one owner account. The schema still records an `owner` role so additional staff roles can be introduced later without rebuilding authorization. Public visitors never see dashboard controls, unpublished listings, private guest data, internal notes, or operational records.

## 2. Supabase responsibilities

| Capability | Supabase service | Rule |
|---|---|---|
| Owner sign-in and session | Auth | Email/password plus mandatory TOTP MFA before production |
| Listings, rooms, bookings, operations | PostgreSQL | One transactional source of truth |
| Property and extra images | Storage | Public read for published media; owner-only write |
| Live dashboard changes | Realtime | Subscribe only to operational tables allowed by RLS |
| Booking and state transitions | Database functions | Validate and commit multi-table changes atomically |
| Payment or privileged integrations | Edge Functions | Secrets stay server-side; never expose a service-role key |

The browser uses only the Supabase publishable key. Every exposed table has RLS enabled. The service-role key is restricted to trusted server-side functions and deployment tooling.

## 3. Administrator navigation

### Access

- `/ops/sign-in`: owner email, password, forgotten-password path, MFA challenge, and session errors.
- No public account registration.
- The first owner is created through a secure bootstrap migration or Supabase administration, then linked to an `app_users` row with role `owner`.
- Unauthenticated access to any `/ops/*` route returns to sign-in and preserves the intended destination.

### Dashboard pages

1. **Overview** — today's arrivals, departures, occupied rooms, dirty rooms, open service orders, unsettled folios, and urgent actions.
2. **Properties** — search, status filters, completeness, starting price, future reservations, preview, edit, archive, and create property.
3. **Property editor** — Basics, Georgian and English content, location, photos, amenities, rooms, rates, policies, extras, and Publish.
4. **Rooms and inventory** — room types, physical units, nightly rates, availability, maintenance blocks, and sell/stop-sell controls.
5. **Reservations** — searchable list and calendar with reservation detail, assignment, changes, cancellation, check-in, and check-out.
6. **Guests** — contact details, stay history, preferences, notes, and privacy actions.
7. **Housekeeping** — room condition board, assignee, priority, cleaning progress, inspection, do-not-disturb, and out-of-service actions.
8. **Room service** — order queue from received through delivered, with folio posting state.
9. **Minibar** — item catalog, stock, room posting, corrections, and folio link.
10. **Folios and invoices** — charges, payments, adjustments, balance, invoice issue/void, and printable invoice.
11. **Analytics** — occupancy, ADR, RevPAR, revenue, booking source, housekeeping time, and service sales.
12. **Settings and audit** — owner security, property defaults, taxes/currency, cancellation policies, and immutable change history.

Mobile navigation uses a compact drawer and task-first views. Wide calendars degrade to an accessible reservation list on small screens; no operation depends on drag and drop.

## 4. Property management workflow

### Create and edit

The owner can create a property as a draft and save each editor step independently. Required publish fields are:

- property type, English and Georgian names, slug, address, map coordinates, check-in/out times;
- at least five optimized photos with one cover image and meaningful alt text;
- at least one active room type and one physical room/unit;
- capacity, bed setup, size, amenities, base rate, currency, tax behavior, and cancellation policy;
- guest contact information and booking terms.

The editor provides a live public preview without publishing. Photo upload supports reorder, replace, crop focal point, alt text, and removal. The application creates responsive image variants and does not upload the camera-original file when a smaller optimized version is sufficient.

### Publish, archive, and delete

- `draft` is visible only to the owner.
- `published` is available to public search when it has active inventory.
- `paused` remains previewable but cannot receive new bookings.
- `archived` is hidden publicly and retained for historic reservations and invoices.
- A never-published draft with no dependent records may be permanently deleted after confirmation.
- A property, room, rate, extra, or amenity referenced by a reservation is archived/deactivated, never hard-deleted.
- A room with a future confirmed stay cannot be deactivated until the stay is reassigned or cancelled.

Every material change records actor, time, entity, previous value, new value, and optional reason in `audit_events`.

## 5. Core data model for the first release

### Public catalog

- `properties`: type, slug, status, address, coordinates, contact, timezone, check-in/out, policy references, display order.
- `property_translations`: property, locale (`en|ka`), name, short description, full description, area label, policies.
- `property_media`: property, storage path, kind, alt text per locale, focal point, width/height, sort order, cover flag.
- `amenities` and `property_amenities`: reusable amenity definitions and property-specific availability/charge notes.
- `room_types`: property, code, capacity, size, beds, accessibility, active status, display order.
- `room_type_translations`: locale-specific room name and description.
- `room_type_media` and `room_type_amenities`.
- `rooms`: physical room/unit, room type, number, floor, active status, occupancy and condition state.
- `rate_plans`, `daily_rates`, and `room_blocks`.
- `catalog_items`: optional extras, minibar items, and room-service items with image, price, availability, stock, and tax data.

### Booking and operations

- `guests`, `reservations`, `reservation_stays`, `reservation_guests`, and `room_assignments`.
- `booking_drafts`, `quotes`, and expiring `inventory_holds`.
- `housekeeping_tasks` and append-only `room_status_events`.
- `service_orders`, `service_order_items`, and `service_order_events`.
- `minibar_postings`, `minibar_posting_items`, and `stock_movements`.
- `folios`, append-only `folio_entries`, `payments`, `refunds`, and immutable invoices.
- `audit_events`, `idempotency_keys`, and `outbox_events`.

The detailed field-level design and transaction rules remain in `database-schema.md`.

## 6. State ownership and transitions

### Reservation

`draft → held → confirmed → checked_in → checked_out`

Alternate terminal paths are `cancelled`, `no_show`, and `expired`. Only a database function may confirm, cancel, check in, or check out a stay. UI buttons request the transition and render the returned result; they do not directly update status columns.

### Room

Room readiness is derived from separate dimensions:

- occupancy: `vacant | occupied`;
- condition: `dirty | cleaning | clean | inspected`;
- availability block: `available | out_of_service | owner_block`.

A room is check-in ready only when it is active, vacant, inspected, not blocked, assigned to the reservation, and the current date is within the permitted arrival window.

### Housekeeping

`open → assigned → in_progress → clean_complete → inspection_required → completed`

`deferred` and `cancelled` are guarded alternate paths. A rejected inspection returns the task to `in_progress` with a required reason. Checkout atomically marks the room vacant and dirty and creates the departure-clean task.

### Room service

`received → accepted → preparing → ready → delivered → closed`

Cancellation requires a reason. Delivery and folio posting are separate, visible states. Retrying a post cannot duplicate the charge.

### Minibar

The owner selects room/reservation, items, quantities, and service time. Confirming a posting atomically creates stock movements and one folio charge per posting. Corrections create reversals; they never edit financial history in place.

## 7. Preventing overlapping reservations

Confirmed or checked-in room assignments use a half-open PostgreSQL `daterange` (`[arrival, departure)`). A GiST exclusion constraint rejects intersecting date ranges for the same physical room. This permits same-day turnover because one stay's departure instant equals the next stay's arrival boundary.

Unassigned room-type inventory is protected inside a transaction that locks each requested property, room type, and stay date before committing. The confirmation function rechecks active rooms, blocks, confirmed stays, and unexpired holds. If inventory changed during checkout, the guest receives a recoverable availability error and no partial reservation or payment is committed.

Editing dates, changing rooms, confirming a booking, and adding a room block all pass through the same availability service. No dashboard form can bypass these constraints.

## 8. Public-site synchronization

- The current hardcoded property and seed modules become fallback fixtures only.
- Public queries read `published` catalog rows and active inventory from Supabase through repository interfaces.
- The owner sees saved changes immediately in dashboard preview.
- Safe catalog edits invalidate TanStack Query caches and may use Realtime to refresh open public/admin views.
- Reservation and financial mutations use confirmed server responses; they do not use optimistic updates.
- Publishing a property emits a cache invalidation event and updates its SEO route data.

## 9. Forms and interaction requirements

- React Hook Form and Zod schemas are shared by create/edit screens and map database errors to specific fields.
- Unsaved changes are clearly shown; navigation asks before discarding them.
- Every primary action has idle, working, success, validation error, permission error, conflict, and retry states.
- Destructive actions state exactly what will happen and require explicit confirmation.
- Tables support keyboard access, pagination, search, filters, saved column preferences, and an equivalent card layout on mobile.
- Date and money inputs are locale-aware but persist canonical dates and integer GEL minor units.
- Georgian fields display a real missing-translation state; English text is never silently copied into Georgian.

## 10. Security and recovery

- Disable public sign-up and allow only the configured owner identity.
- Require a strong unique password, TOTP MFA, short idle timeout, secure reset flow, and a second protected recovery factor before production.
- RLS public policies allow only published catalog reads. Owner policies require the authenticated user's active `owner` record; financial/state transitions additionally require security-definer functions with explicit input validation.
- Storage policies allow the owner to upload/update property media and the public to read only media linked to published content.
- Never store card numbers or sensitive payment data in Velora.
- Use automatic backups and test restoration before launch.
- Redact guest contact and payment metadata from logs and analytics.

## 11. Controlled implementation phases

### A. Foundation and owner access

Create migrations, generated database types, environment validation, owner bootstrap, protected routing, RLS policies, MFA-ready sign-in, audit helper, and repository contracts.

**Exit:** an unauthenticated browser cannot read private rows or mutate any row; the allowlisted owner can sign in; the service-role key is absent from the client bundle.

### B. Listing CMS

Build Properties, create/edit wizard, translations, amenities, photo manager, room types, preview, publishing, pausing, and archiving. Replace the public hardcoded directory with published Supabase data while retaining deterministic local fixtures.

**Exit:** the owner can create a complete apartment, upload/reorder images, publish it, see it on public search and detail pages, edit it, and archive it without changing code.

### C. Inventory, rates, and reservations

Build physical rooms, daily rates, blocks, availability RPC, reservation list/detail/calendar, assignment, modification, and cancellation.

**Exit:** two simultaneous attempts for the final room produce exactly one confirmation; all date and room changes respect the same constraint.

### D. Front desk and housekeeping

Build arrivals/departures, guarded check-in/out, room status controls, housekeeping board, assignment, cleaning, and inspection.

**Exit:** check-in changes occupancy; checkout creates a dirty departure task; inspection makes the room ready for the next stay.

### E. Services, minibar, folios, and invoices

Build catalogs, orders, stock/postings, folio ledger, payments, corrections, settlement, and invoices.

**Exit:** delivery/minibar actions create exactly one charge; checkout is blocked by an unsettled folio unless an audited override is used.

### F. Analytics, hardening, and launch

Add metric views, Realtime subscriptions, audit UI, backups, performance budgets, accessibility tests, concurrency tests, and production monitoring.

**Exit:** public and owner journeys pass desktop/mobile E2E tests; security, accessibility, performance, restore, and investor-demo checks pass.

## 12. Immediate next implementation slice

The first build slice should be A plus the smallest part of B:

1. Provision a Supabase development project and environment variables.
2. Add migrations for owner identity, properties, translations, media, amenities, room types, and rooms.
3. Enable RLS and add published-read and owner-write policies.
4. Replace demo workspace access with real protected owner sign-in.
5. Add `/ops/properties`, `/ops/properties/new`, and `/ops/properties/:id/edit`.
6. Connect one public property card and detail page to the repository, then migrate the remaining fixtures.

This vertical slice proves authentication, authorization, CRUD, media, translation, publish state, and public synchronization before operational complexity is added.

## 13. Acceptance criteria

- The owner can change every public property value without a deployment.
- Every published property uses one consistent detail template with its own data and media.
- Draft, paused, and archived properties never appear in anonymous queries.
- Listings with historic or future bookings cannot be destructively deleted.
- The database, not the React UI, rejects overlapping confirmed room assignments.
- Check-in, checkout, housekeeping, service, minibar, folio, and invoice transitions are atomic and audited.
- Public-site data refreshes after an approved owner edit without stale duplicate data sources.
- English and Georgian content are editable independently and display correctly.
- All owner workflows work at 320 px, tablet, and desktop widths with keyboard and visible focus.
- Loading, empty, success, validation, conflict, permission, offline, and server-error states are implemented for every dashboard page.
- No privileged secret or unrestricted key appears in the frontend bundle.
- Automated tests cover RLS policies, state transitions, overlap concurrency, financial idempotency, CRUD, and critical E2E journeys.
