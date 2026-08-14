# Velora Product Specification

**Status:** implementation-ready product definition  
**Research date:** 11 August 2026  
**Audience:** product, design, engineering, QA, operations, and investors

## 1. Product thesis

Velora is one coherent hospitality platform with two purpose-built surfaces:

1. **Velora Stay** — a public, responsive luxury hotel experience for discovery, availability search, room selection, extras, test payment, confirmation, and reservation self-service.
2. **Velora Ops** — an authenticated property-management workspace for reservations, guests, inventory, arrivals/departures, housekeeping, service orders, folios/invoices, analytics, and simulated OTA synchronization.

The investor story is not “a beautiful hotel template plus an admin panel.” It is a shared operational system: a direct booking changes sellable inventory immediately; a checkout makes the room dirty; housekeeping inspection makes it ready; minibar and room-service charges change the same folio the guest and front desk see.

### Product principles

- **Luxury is composure.** Editorial imagery, generous space, precise type, few simultaneous calls to action, and property-specific storytelling.
- **Booking is a transaction.** Search is prominent, inventory is truthful, full-stay price is visible, policies are readable, and progress is recoverable.
- **Operations are exception-led.** The dashboard foregrounds arrivals, departures, unassigned rooms, dirty rooms, unpaid balances, conflicts, and failed syncs.
- **One fact, one owner.** Inventory, reservation, folio, and room condition each have an authoritative record and audit history.
- **Status never relies on color alone.** Labels, icons, shape, and text accompany color.
- **Demonstrable, not deceptive.** Payments and OTA sync are clearly labeled simulated/test mode.

## 2. Repository findings and technical posture

The repository contained only empty `work/` and `outputs/` directories at discovery. There was no application stack, package manifest, source tree, design system, database, or asset collection. Therefore:

- these specifications become the initial source of truth;
- the implementation plan recommends a stack but does not claim one exists;
- all photography, copy, logos, and icons must be newly created, commissioned, licensed, or sourced from explicit demo-safe libraries;
- no interface code is authorized by this specification task.

## 3. Live research synthesis

### 3.1 Luxury hospitality art direction

- Aman presents properties as context-specific sanctuaries shaped by landscape and culture, with restrained copy and destination-first imagery. The reusable principle is **place before product**, not its branding or copy. [Aman hotels and resorts](https://www.aman.com/hotels-and-resorts), [Aman destinations](https://www.aman.com/destinations)
- EDITION combines localized identity with lifestyle programming—rooms, dining, entertainment, and editorial culture—supporting **a property as a living destination**, not only a bed inventory. [EDITION home](https://www.editionhotels.com/), [The EDITION idea](https://www.editionhotels.com/the-idea/)
- Velora’s original response is “quiet radiance”: warm mineral surfaces, dusk-blue contrast, botanical green, filmic crops, candid human-scale details, and short factual prose. It must not reproduce either brand’s marks, layouts, slogans, copy, or photographic treatments.

### 3.2 Search and booking

- Airbnb makes destination/dates/party the search contract; results for entered criteria should be available, and filters cover price, room/bed needs, amenities, booking options, and accessibility. [Airbnb search features](https://www.airbnb.com/help/article/3117), [Airbnb search filters](https://www.airbnb.com/help/article/479)
- Booking.com’s current search exposes destination, two-month date selection, exact/flexible dates, party/room controls, list/map switching, filters, and sorting. [Booking.com live search example](https://www.booking.com/city/ma/settat.html)
- Baymard’s January 2026 benchmark finds many accommodation experiences still fail on homepage search prominence, pricing transparency, filters, and review support. Its 2025 guidance reports that missing industry-specific information causes abandonment. [2026 benchmark](https://baymard.com/blog/travel-accommodations-ux-benchmark-2026), [2025 travel best practices](https://baymard.com/blog/travel-site-ux-best-practices)
- Baymard also finds that perceived checkout effort is driven more by fields than step count, and recommends delaying optional account creation until after purchase. [Checkout field research](https://baymard.com/blog/checkout-flow-average-form-fields), [Post-checkout UX](https://baymard.com/blog/post-checkout-ux-best-practices)

### 3.3 PMS operations

- Mews emphasizes a live timeline tying availability, assignments, price, payment, front desk, and two-way channel sync together, with visual warnings for gaps and overbooking. [Mews reservation management](https://www.mews.com/en/products/reservation-management), [Mews timeline help](https://help.mews.com/s/article/timeline)
- Cloudbeds’ 2025–2026 calendar supports reservation summaries, status-dependent actions, unassigned inventory, assignment locking, drag moves with price-difference confirmation, and direct room-condition editing. [Calendar management](https://myfrontdesk.cloudbeds.com/hc/en-us/articles/18387139910939-Manage-reservations-on-the-calendar), [Assignment locks](https://myfrontdesk.cloudbeds.com/hc/en-us/articles/360049614594-Lock-Unlock-assignments-on-the-calendar), [Housekeeping from calendar](https://myfrontdesk.cloudbeds.com/hc/en-us/articles/48389981165083-Managing-Housekeeping-and-Room-Status-from-the-New-Calendar)
- Cloudbeds explicitly separates housekeeping condition from sellable inventory: dirty rooms may remain bookable, while out-of-service blocks inventory. Velora adopts this separation. [Housekeeping room conditions](https://myfrontdesk.cloudbeds.com/hc/en-us/articles/216540808-Housekeeping-room-conditions)

### 3.4 Accessibility and responsive standards

- Target **WCAG 2.2 AA**, including focus not obscured, 24×24 CSS px minimum pointer targets or sufficient spacing, redundant-entry avoidance, accessible authentication, error prevention for financial data, and programmatic status messages. [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [What is new in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- Booking calendars must support typed input as well as a fully labeled keyboard-operable dialog/grid. W3C’s APG is informative and must be verified with real assistive technologies. [WAI date-picker example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- Content must reflow without information loss at 320 CSS px; operational grids are an allowed two-dimensional exception, but must offer an equivalent stacked/list view on narrow screens. [WCAG reflow understanding](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- Performance targets follow current Core Web Vitals: LCP ≤2.5 s, INP <200 ms, CLS <0.1 at the 75th percentile. [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)

## 4. Users and permissions

| Persona | Primary goal | Access |
|---|---|---|
| Leisure guest | Confidently choose and book a memorable stay | Public and magic-link reservation portal |
| Returning guest | Retrieve, modify, enhance, or cancel a booking | Magic link plus surname; optional post-booking account later |
| Front desk agent | Run arrivals, in-house stays, departures, room moves, and folios | Reservations, guests, rooms, billing; restricted refunds |
| Housekeeper | See assigned work and update room condition quickly | Mobile-first housekeeping scope only |
| Housekeeping supervisor | Assign, inspect, block, and release rooms | Housekeeping plus room operational controls |
| F&B/service agent | Create and fulfill room-service/minibar charges | Orders and charge posting; no rate edits |
| Property manager | Monitor property, configure inventory/rates, handle exceptions | All property operations and reports |
| Finance manager | Reconcile folios, payments, refunds, invoices, and taxes | Billing and reports; no room-condition editing by default |
| Demo investor | Understand guest-to-operations value in under 8 minutes | Seeded, resettable demo role with guided tour |

All staff actions are property-scoped and role-based. Sensitive actions require reason entry and audit logging: cancellations after penalty, rate overrides, refunds, comp/void, force check-in, force checkout, room out-of-service, and conflict override.

## 5. Functional scope

### 5.1 Velora Stay pages and capabilities

1. **Home:** brand story, primary availability search above the fold, featured rooms, dining/wellness, location, and offers.
2. **Rooms index:** room-type comparison with occupancy, bed, size, key amenities, accessibility, from-price, and availability-aware CTA.
3. **Room detail:** gallery, facts, sleep configuration, accessibility facts, amenities, policies, cancellation terms, and sticky search/booking action.
4. **Experiences:** dining, wellness, local activities, and purchasable stay extras.
5. **Offers:** eligibility, inclusions, blackout dates, and rate-plan linkage.
6. **Gallery:** categorized, captioned, optimized media with reduced-motion behavior.
7. **Location/contact:** map alternative, transport, parking, nearby highlights, contact methods, accessibility contact.
8. **Availability results:** dates/party summary, filter/sort, available room/rate combinations, total-stay pricing, comparison, and no-results alternatives.
9. **Booking—stay details:** selected room/rate, policy, price breakdown, editable dates/party.
10. **Booking—extras:** optional quantities/schedules, clear pricing, skip action, live total.
11. **Booking—guest and payment:** guest checkout, contact/staying guest data, requests, consent, billing details, test card entry, final review, idempotent submit.
12. **Confirmation:** confirmation number, stay summary, total/payment state, next steps, calendar download, email status, manage-booking link, and optional account invitation.
13. **Manage reservation:** magic-link access; view, add extras, update arrival time/contact/request, cancel when permitted, and see invoice/payment history.
14. **Policy/privacy/accessibility/error pages:** cancellation, terms, privacy, cookie preferences, accessibility statement, 404, 500, and offline/service-unavailable states.

### 5.2 Velora Ops pages and capabilities

1. **Sign in / recovery:** accessible authentication, demo login, password reset, session expiry recovery.
2. **Today dashboard:** arrivals, departures, in-house, occupancy, room readiness, unpaid balances, service SLA, sync health, and prioritized exceptions.
3. **Reservations list:** search, saved filters, status/date/source/balance filters, bulk export, create reservation.
4. **Timeline/calendar:** rooms by type, date scale, bookings, blocks, holds, unassigned rail, drag/resize with preview and conflict check, zoom, keyboard alternative.
5. **Reservation detail:** overview, guests, stay/assignment, notes/tasks, extras/orders, folio/payments, messages, sync, and audit log.
6. **Guests:** deduplicated profiles, stay history, preferences, accessibility requests, consent, balance, notes, and merge flow.
7. **Rooms:** room list, room types, occupancy, condition, operational status, assignment, maintenance notes, and history.
8. **Arrivals/check-in:** readiness, registration details, identity document marker (no raw document in demo), deposit/payment, room assignment, key issuance marker.
9. **Departures/check-out:** folio review, late charges, payment/credit, invoice recipient, room transition.
10. **Housekeeping board:** dirty/clean/inspected, DND, service type, priority, assignee, due/SLA, mobile task view, inspection rejection.
11. **Minibar:** room/posting date/items/quantity, stock snapshot, comp/void with reason, post to folio.
12. **Room service:** menu, order entry, preparation/delivery states, room/guest verification, service charge/tax, posting and void/refund.
13. **Folios and invoices:** line items, transfers/splits, payments, deposits, refunds, adjustment reasons, issue/void invoice, print/download.
14. **Analytics:** occupancy, ADR, RevPAR, revenue mix, booking source, lead time, cancellation, service sales, housekeeping turnaround; date comparison and CSV export.
15. **Channel manager:** simulated Booking.com/Airbnb connections, event log, mapping, queued/sent/acknowledged/failed states, retry and conflict resolution.
16. **Settings:** property, rooms/types, rate plans, taxes/fees, extras/menu/minibar catalog, users/roles, integrations, notification templates, demo reset.

## 6. Core business rules

### Availability and reservation overlap

- A stay occupies half-open interval `[check_in, check_out)` in the property timezone. Same-day checkout and arrival in one room are allowed.
- Search is by room type; confirmation atomically allocates inventory. A physical room may remain unassigned until arrival.
- Sellable inventory = active physical rooms − out-of-service blocks − active committed reservations, adjusted by an explicit overbooking limit that is `0` in the demo.
- Committed statuses are `hold`, `confirmed`, and `in_house`; `draft`, `cancelled`, `no_show`, and `checked_out` do not consume future inventory. A hold expires automatically.
- The final create/update transaction locks the relevant room-type inventory rows and rechecks capacity. If inventory changed, payment is not captured and alternatives are returned.
- Once a physical room is assigned, a database exclusion constraint prevents intersecting committed reservation-room intervals. Application checks improve messages but are never the sole guard.
- OTA imports use idempotency key `(channel, external_reservation_id)` and the same availability transaction. A conflict is quarantined; it is never silently assigned.

### Pricing and money

- Store money as integer minor units plus ISO 4217 currency. Never use floating point.
- Quote snapshots preserve nightly rates, discounts, fees, taxes, cancellation terms, occupancy, and expiry. Confirmation uses a valid quote or requotes with explicit consent.
- Show the full stay total beside nightly context from results onward. Explain taxes/fees and payment timing before commitment.
- Test payments use provider tokens only. Store no PAN or CVC. Payment mutation endpoints require idempotency keys.
- Folio line items are immutable after posting; correction uses linked adjustment/void lines. Invoice numbers are sequential per property and immutable after issue.

### Check-in and checkout

- Normal check-in requires `confirmed`, today within configured early/late rules, assigned active room, room condition `inspected`, registration complete, and deposit/payment rule satisfied.
- A manager may force check-in to `clean` or outside window with reason; never into `dirty`, `cleaning`, or `out_of_service` without first resolving that state.
- Check-in sets reservation `in_house`, occupancy `occupied`, records actual time and actor, and queues channel/status events.
- Normal checkout requires `in_house`, final folio review, and either zero balance or an approved city-ledger/waiver disposition.
- Checkout sets reservation `checked_out`, occupancy `vacant`, condition `dirty`, creates a departure clean task, records key return marker, finalizes invoice if requested, and queues notifications.

### Housekeeping and operational status

- Condition state is separate from occupancy and sellability.
- Standard departure path: `inspected → occupied → dirty → cleaning → clean → inspected`.
- Stayover service may move `inspected/clean → cleaning → inspected` while occupancy remains `occupied`; DND defers the task and records a timestamp.
- Inspection rejection moves `clean → cleaning` with required reason.
- `out_of_service` is an operational block with start/end/reason and removes sellable inventory; restoring it requires a target condition, normally `dirty` or `cleaning`.
- All transitions are timestamped and attributed.

### Extras, minibar, and room service

- Extras define fulfillment mode (`per_stay`, `per_night`, `per_person`, `per_unit`, `scheduled`), tax class, lead time, capacity, and cancellation rule.
- Pre-arrival extras create fulfillment tasks and folio lines. Quantity/date changes reprice transparently.
- Minibar posts verified item, quantity, unit price snapshot, tax, room, reservation, posting time, and staff actor. Negative quantity is prohibited; corrections are linked void/adjustments.
- Room service uses `draft → submitted → accepted → preparing → ready → delivered → posted`; cancellation is allowed before `preparing`, later cancellation requires manager comp/void reason.
- A service order is posted once to one open folio using an idempotent operation. Fulfillment and financial posting are distinct statuses.

### Cancellation, no-show, and modification

- Guest cancellation is offered only while policy permits self-service; penalty and refund are shown before confirmation.
- Cancellation releases inventory in the same transaction and creates refund action when applicable.
- Date/room changes create a new quote, verify availability atomically, preserve audit history, and never overwrite the original price snapshot.
- No-show can be set after the configured cutoff; it releases future nights, posts the policy charge, marks room vacant/condition unchanged, and records actor/reason.

## 7. Cross-product states

Every data-driven surface implements:

| State | Required behavior |
|---|---|
| Initial loading | Layout-matched skeleton; retain navigation; no fake values; announce longer loads after 1 second |
| Background refresh | Preserve content, show subtle last-updated/progress status, no layout shift |
| Empty-first-use | Explain purpose and show one permission-valid primary action |
| Empty-filtered | State that filters caused zero results and offer clear-all; preserve filter controls |
| Success | Confirm object/action and next step; toast for reversible minor actions, page state for major actions |
| Validation error | Inline field message plus summary linked to fields; preserve input; move focus to summary on submit |
| Conflict/stale data | Explain what changed, show current value, allow refresh/review; never overwrite silently |
| Permission denied | Explain required role and safe route back; do not reveal sensitive data |
| System/offline error | Preserve safe draft locally where appropriate; reference ID, retry, alternate contact/action |
| Destructive confirmation | Name impact, amount/status, and reversibility; require reason for privileged exceptions |

## 8. Non-functional requirements

- WCAG 2.2 AA across complete guest booking and core staff workflows; target AAA contrast for body text where compatible with identity.
- Keyboard-only completion for search, booking, check-in/out, housekeeping, and folio payment; non-drag alternatives for timeline moves.
- Screen-reader testing with NVDA + Chrome/Firefox and VoiceOver + Safari; 200% and 400% zoom testing.
- Guest pages meet Core Web Vitals “good” thresholds at p75; responsive images and reserved media dimensions.
- Property-local time for operational rules, UTC timestamps at rest, explicit DST tests, localized display, ISO dates in APIs.
- Audit logs are append-only; PII is encrypted in transit/at rest; staff sessions time out; least-privilege RBAC; rate limiting and CSRF protection.
- Booking/payment/checkout endpoints are transactional and idempotent. Nightly reconciliation detects inventory, folio, and sync inconsistencies.
- Demo supports deterministic reset without touching non-demo environments.

## 9. Demo property and investor narrative

**Property:** Velora Cove, an original 42-key coastal retreat in fictional Cala Aurelia.  
**Room types:** Garden Atelier (12), Sea Terrace (16), Horizon Suite (10), Velora Residence (4), including documented accessible units.  
**Seed window:** 45 days before and 90 days after the fixed demo date; 65–78% occupancy with credible arrivals, stays, departures, blocks, and gaps.  
**Currency/timezone:** EUR; Europe/Rome for demo purposes.  
**Channels:** Direct, Booking.com (simulated), Airbnb (simulated), phone, walk-in.

### Eight-minute investor flow

1. Open guest homepage; search a two-night stay for two guests.
2. Compare room/rate combinations with complete totals and accessible-room facts.
3. Select Horizon Suite, add an arrival transfer and breakfast, pay with a clearly marked test card.
4. Show confirmation and magic-link management; change ETA.
5. Switch to Ops: the new direct booking appears on timeline and Today metrics.
6. Assign a room, inspect readiness, take test deposit, and check in.
7. Post a minibar item and move room-service order to delivered; show shared folio.
8. Checkout; room becomes dirty, housekeeping cleans/inspects it, invoice finalizes, analytics update, and an OTA sync event is acknowledged.

Seed deliberate exceptions for optional follow-up: one unassigned arrival, one dirty VIP room, one failed OTA event, one payment due, one maintenance block. A “Reset demo” action restores the snapshot with explicit confirmation.

## 10. Acceptance criteria

These are release gates; detailed page behavior lives in the linked specifications.

### Guest discovery and search — AC-GS

- **AC-GS-01:** Search accepts valid check-in/check-out and party, rejects past/zero-night/over-capacity input inline, and is usable at 320 CSS px and by keyboard.
- **AC-GS-02:** Results contain only room types with capacity for the complete half-open stay interval at request time.
- **AC-GS-03:** Every rate card shows full-stay total, currency, nightly context, included/excluded taxes/fees, payment timing, and cancellation summary.
- **AC-GS-04:** Filters include occupancy/bed, price, amenities, accessibility, and rate flexibility; clear-all restores results and focus.
- **AC-GS-05:** No availability returns explainable alternatives (adjacent dates and/or room types) without representing them as exact matches.

### Room evaluation — AC-RM

- **AC-RM-01:** Room pages expose original licensed media, captions/alt text, capacity, bed, size, amenities, accessibility facts, and policies.
- **AC-RM-02:** Updating dates or party requotes availability without losing the user’s place; stale prices require explicit review.
- **AC-RM-03:** Mobile sticky CTA never obscures focused controls or final content.

### Booking, extras, payment, confirmation — AC-BK

- **AC-BK-01:** A guest can complete booking without an account and is offered optional account creation only after confirmation.
- **AC-BK-02:** Optional extras can be skipped; quantity/schedule changes update itemized total and enforce capacity/lead time.
- **AC-BK-03:** Required visible fields are limited to transaction/legal need, use correct autocomplete/input modes, and preserve entries after recoverable errors.
- **AC-BK-04:** Final review repeats dates, nights, guests, room/rate, policies, extras, taxes/fees, total, and charge timing before “Pay & reserve.”
- **AC-BK-05:** Double submission produces one reservation and at most one successful payment; inventory is rechecked atomically before confirmation.
- **AC-BK-06:** Declines retain the booking draft and provide retry/change-payment; ambiguous gateway outcomes reconcile before another charge attempt.
- **AC-BK-07:** Confirmation page and email expose the same number, stay, payment state, next steps, and secure manage link.

### Reservation self-service — AC-MY

- **AC-MY-01:** A single-use/expiring magic link plus booking identity grants only that reservation’s allowed actions.
- **AC-MY-02:** ETA/contact/request changes persist and audit; sold extras can be added with a new payment when required.
- **AC-MY-03:** Cancellation preview states penalty/refund/inventory impact; confirmation cancels once, releases stock, and sends notice.
- **AC-MY-04:** Expired/invalid links reveal no reservation data and offer a safe reissue path.

### Reservations and timeline — AC-OP

- **AC-OP-01:** List and timeline agree on dates, status, room, source, guest, and balance after refresh or real-time update.
- **AC-OP-02:** Creating, moving, or resizing a stay previews rate/room consequences and is rejected on capacity or physical-room overlap.
- **AC-OP-03:** Drag operations have keyboard/form equivalents; locked assignments cannot move without authorized unlock.
- **AC-OP-04:** Reservation detail shows all operational and financial history, with actor/time for sensitive mutations.
- **AC-OP-05:** Concurrent edits surface a stale-data conflict instead of last-write-wins loss.

### Check-in/out — AC-FD

- **AC-FD-01:** Normal check-in is unavailable until required registration, payment rule, assignment, and inspected condition pass.
- **AC-FD-02:** Authorized exception check-in records actor, reason, previous state, and visible warning.
- **AC-FD-03:** Checkout blocks on unresolved balance unless an authorized disposition is recorded.
- **AC-FD-04:** Successful checkout atomically records actual departure, vacates room, sets condition dirty, creates housekeeping work, and updates folio/invoice state.

### Housekeeping and rooms — AC-HK

- **AC-HK-01:** Room condition, occupancy, and sellability are independently visible and never inferred from color alone.
- **AC-HK-02:** Departure automatically creates a dirty turnover task; clean then inspection makes the room check-in-ready.
- **AC-HK-03:** DND defers service without marking it complete; rejection requires a reason and returns work to cleaning.
- **AC-HK-04:** Out-of-service blocks inventory for its interval and requires reason, owner, and release state.
- **AC-HK-05:** Housekeepers can complete assigned core tasks on a 320 px mobile viewport with 44 px preferred controls.

### Services, minibar, and billing — AC-BL

- **AC-BL-01:** Extras/minibar/orders retain price and tax snapshots; catalog edits do not rewrite posted charges.
- **AC-BL-02:** Delivery and folio posting are independently traceable; retries cannot duplicate a line.
- **AC-BL-03:** Posted financial lines cannot be edited or deleted; void/comp/refund uses a linked adjustment and reason.
- **AC-BL-04:** Folio math reconciles charges − discounts/adjustments − payments/refunds to balance exactly in minor units.
- **AC-BL-05:** Issued invoices have immutable sequential numbers and reproducible totals; PDF/print output is accessible and legible.

### Analytics and channels — AC-AN

- **AC-AN-01:** Occupancy, ADR, and RevPAR definitions are shown and reconcile to seeded reservation/room data for the selected range.
- **AC-AN-02:** Filters, comparison periods, empty data, partial data, and CSV export behave consistently.
- **AC-AN-03:** Simulated channel events show channel, direction, entity, idempotency key, payload summary, attempts, and state.
- **AC-AN-04:** Failed events can retry safely; duplicate imports do not duplicate reservations; conflicts are quarantined and visible.
- **AC-AN-05:** Every simulated surface is labeled “Simulation” and never claims a live Booking.com/Airbnb integration.

### Accessibility, responsive, security, and demo — AC-NF

- **AC-NF-01:** Automated axe checks report no critical/serious issues on release routes; manual keyboard and named screen-reader journeys pass.
- **AC-NF-02:** Complete guest and operational core tasks work at 320 CSS px; timeline/table exceptions have equivalent list views.
- **AC-NF-03:** Guest p75 field data or controlled launch tests meet LCP ≤2.5 s, INP <200 ms, CLS <0.1.
- **AC-NF-04:** Unauthorized cross-property/resource access is rejected server-side; sensitive actions are audited.
- **AC-NF-05:** Demo reset restores the documented deterministic snapshot and is unavailable outside demo scope.
- **AC-NF-06:** No copied branding, copy, proprietary icons, or unlicensed imagery appears in the product.

## 11. Out of scope for the investor release

Real payment capture, production OTA certification, loyalty points, multi-property central reservations, yield/revenue-management automation, accounting-system export, government ID OCR, smart locks, payroll, procurement, full restaurant POS, real email/SMS deliverability, and native mobile apps. Architecture should leave seams for these; the demo must not imply they are operational.

