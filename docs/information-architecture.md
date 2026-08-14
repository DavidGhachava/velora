# Velora Information Architecture

This document defines route ownership, navigation, page hierarchy, findability, and responsive adaptation. It complements the business rules in [product-spec.md](product-spec.md).

## 1. Surface and tenancy model

- `/` is the public Velora Stay surface for one demo property.
- `/booking/*` is an enclosed checkout: simplified header, persistent stay summary, no distracting global promotions.
- `/manage/*` is a secure guest self-service surface reached by expiring token; URLs and analytics must not leak tokens.
- `/ops/*` is authenticated Velora Ops, property-scoped, role-filtered, and visually distinct.
- Property context is a first-class header control in Ops even when the demo contains one property; switching property clears incompatible filters.

## 2. Public route map

```text
/
├── /rooms
│   └── /rooms/[room-type-slug]
├── /experiences
│   └── /experiences/[experience-slug]
├── /offers
│   └── /offers/[offer-slug]
├── /gallery
├── /location
├── /contact
├── /availability?checkIn=&checkOut=&adults=&children=&rooms=
├── /booking/[draft-id]
│   ├── /stay
│   ├── /extras
│   ├── /guest-payment
│   └── /confirmation
├── /manage/request-link
├── /manage/[token]
│   ├── /overview
│   ├── /enhance
│   ├── /details
│   ├── /payments
│   └── /cancel
├── /policies/cancellation
├── /privacy
├── /terms
├── /accessibility
└── /not-found, /error, /offline
```

### Public global navigation

Desktop header: Velora wordmark; Rooms; Experiences; Offers; Gallery; Location; contact/language utilities; **Reserve** primary action. Header transitions from transparent over safe hero imagery to solid on scroll, with contrast verified in both modes.

Mobile header: wordmark, **Reserve**, and menu. The menu is a modal dialog with focus trap, visible close, Escape support, and scroll lock. Reserve remains reachable without opening it.

Footer: compact brand statement, address/contact, directions, policies, privacy/cookies, accessibility, social links, newsletter consent, and “Manage reservation.”

## 3. Guest content hierarchy

| Page | First decision | Supporting content | Primary action |
|---|---|---|---|
| Home | “Is this my kind of place, and is it available?” | Character, rooms, experience, location | Search availability |
| Rooms | “Which room fits?” | Comparable facts and from-price | View room / check dates |
| Room detail | “Can I picture and trust this stay?” | Gallery, facts, amenities, access, policy | Select dates / reserve |
| Availability | “What can I book for this exact party?” | Room/rate comparison and total | Select rate |
| Stay review | “Is the core booking correct?” | Price/policy breakdown | Continue to extras |
| Extras | “Would anything improve the stay?” | Optional benefit, schedule, price | Continue / skip |
| Guest & payment | “What will I pay and agree to?” | Form, review, policies, help | Pay & reserve |
| Confirmation | “Did it work; what next?” | Number, receipt, arrival plan | Manage reservation |
| Manage | “What can I change safely?” | Stay, payment, policy, contacts | Contextual action |

## 4. Ops route map

```text
/ops/sign-in
/ops/forgot-password
/ops
├── /today
├── /reservations
│   ├── /new
│   └── /[reservation-id]
├── /timeline
├── /arrivals
├── /departures
├── /guests
│   └── /[guest-id]
├── /rooms
│   ├── /types
│   └── /[room-id]
├── /housekeeping
│   └── /tasks/[task-id]
├── /services
│   ├── /room-service
│   │   └── /orders/[order-id]
│   └── /minibar
├── /billing
│   ├── /folios/[folio-id]
│   ├── /invoices/[invoice-id]
│   └── /payments
├── /analytics
│   ├── /overview
│   ├── /rooms
│   ├── /revenue
│   └── /services
├── /channels
│   ├── /overview
│   ├── /events
│   ├── /conflicts
│   └── /mapping
├── /settings
│   ├── /property
│   ├── /inventory
│   ├── /rates-taxes
│   ├── /catalogs
│   ├── /users-roles
│   ├── /templates
│   ├── /integrations
│   └── /demo
└── /help
```

### Ops primary navigation

1. **Today**
2. **Timeline**
3. **Reservations**
4. **Guests**
5. **Rooms**
6. **Housekeeping**
7. **Services** — Room service, Minibar
8. **Billing** — Folios, Invoices, Payments
9. **Analytics**
10. **Channels**
11. **Settings** (role-gated)

Desktop uses a collapsible left rail with icon + text and stable order. Tablet supports compact rail. Mobile uses a bottom bar for Today, Timeline/List, Housekeeping, Reservations, More; permissions remove unavailable items without shifting the first four. Breadcrumbs begin below the product header for details and settings.

### Global Ops utilities

- Property selector
- Global search/command (`Ctrl/Cmd+K`) across reservation number, guest, room, invoice
- Business date and local time
- Sync and connection health
- Notifications/exceptions
- Help and shortcuts
- User/account/session menu

## 5. Page anatomy

### Today

Page title/business date → exception strip → KPI row → arrivals/departures/in-house worklists → room readiness → service SLA → channel/payment alerts. KPIs link to filtered records. No decorative chart precedes urgent work.

### Timeline

Sticky toolbar (date, today, zoom, filters, search, legend) → unassigned rail → room-type groups and room rows → horizontally scrollable date grid → selection/detail drawer. A “List view” is always available and is the narrow-screen/accessibility equivalent.

### Reservation detail

Header: guest, status, confirmation, dates, room, source, balance, primary next action. Tabs: Overview; Guests; Stay & room; Services; Folio; Messages; Activity. Desktop contextual summary sits right; mobile summary becomes an expandable section before tabs.

### Housekeeping

Date/team/condition filters → readiness summary → board/list grouped by priority or floor → task drawer. Mobile defaults to “My tasks,” one card per room, large transition buttons, offline-aware pending status.

### Folio

Guest/reservation context → balance and payment state → grouped line items → payments/refunds → invoice history → role-valid actions. The money summary remains visible but never covers fields.

## 6. Navigation behavior

- Preserve list filters, sort, column preferences, scroll position, and timeline date range when returning from detail.
- Every drawer has a shareable full-page route; browser Back closes the drawer and restores context.
- Deep links check authentication, property membership, and role before data is returned.
- Global search results are grouped by object and expose distinguishing details; no sensitive data appears before authorization.
- Unsaved forms warn on navigation; auto-saved notes display saved/pending/failed status.
- Destructive or financial actions never live only in overflow menus on mobile.

## 7. Responsive information adaptation

| Width/context | Public | Ops |
|---|---|---|
| 320–479 px | Single column, sheet date picker, bottom booking CTA, swipe gallery plus buttons | Task/list-first, bottom nav, full-screen detail sheets, no required grid interaction |
| 480–767 px | Single/occasional 2-up cards, concise sticky summary | Cards or compact tables, full-screen filters, horizontal timeline optional |
| 768–1023 px | 2-up editorial grid, dual-month calendar if space permits | Compact rail, 2-column details, timeline with fewer days |
| 1024–1439 px | 12-column layout, sticky booking panels | Full rail, dense tables, side drawers, 14–21 day timeline |
| ≥1440 px | Controlled max widths; images may bleed, text does not | Higher timeline density, 21–31 days; line lengths remain bounded |

Breakpoints are layout outcomes, not device labels. Components use container queries where their reuse requires local adaptation. Data tables prioritize, pin, hide into disclosure, or switch to cards; they never merely shrink text.

## 8. Naming and findability rules

- Use guest language publicly: “Room,” “Total for 2 nights,” “Manage reservation,” not inventory jargon.
- Use established staff language in Ops: “In house,” “Folio,” “Out of service,” with glossary tooltips for less common terms.
- “Room type” means sellable category; “Room” means physical unit; “Reservation” is the commercial booking; “Stay” is its occupied interval; “Folio” is the ledger.
- Status nouns/adjectives stay consistent across surfaces: `Confirmed`, not alternating with `Booked`.
- Searchable identifiers use human-friendly prefixes: `VLR-2608-1042` reservation, `INV-2026-00418` invoice.

## 9. IA acceptance checks

- Every page in product scope has one canonical route and a documented entry point.
- Every critical task is reachable in ≤3 navigation actions after sign-in, excluding object selection.
- Back navigation restores prior filters/context on lists and timeline.
- Mobile exposes an equivalent completion path for every core workflow.
- Role-gated navigation and server authorization agree in automated permission tests.
- Each page has a unique title, one visible H1, correct landmark structure, and a skip link.

