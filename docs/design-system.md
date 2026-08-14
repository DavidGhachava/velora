# Velora Design System — “Quiet Radiance”

## 1. Original identity

Velora’s identity is calm, tactile, and luminous: the feeling of arriving at a stone terrace just after sunset. It borrows reusable principles—not expression—from luxury hospitality references: destination-led storytelling, selective motion, confident whitespace, editorial image sequencing, and individualized experiences. It must not copy Aman or EDITION marks, copy, page compositions, typography pairings, or image treatments.

### Brand attributes

- **Composed:** low visual noise, stable geometry, no manufactured urgency.
- **Warm:** mineral neutrals, attentive language, human imagery.
- **Precise:** factual room comparisons, explicit prices, clear status.
- **Alive:** occasional botanical color and soft motion, local culture and service.

### Product modes

- **Stay mode:** editorial, immersive, generous, image-led.
- **Ops mode:** compact, scan-first, data-led. Uses the same type/color foundations but higher information density and flatter surfaces.
- Both modes preserve shared semantics: focus, success, warning, danger, link, and status tokens never change meaning.

## 2. Design tokens

Tokens use semantic aliases; components must not reference raw palette values directly.

### Color

| Token | Value | Use |
|---|---:|---|
| `--sand-25` | `#FCFAF6` | Stay canvas |
| `--sand-50` | `#F7F3EB` | Subtle surface |
| `--stone-100` | `#E8E0D4` | Rules, muted fill |
| `--stone-300` | `#B9AA98` | Strong borders/decorative only |
| `--ink-700` | `#343532` | Secondary text |
| `--ink-900` | `#171B19` | Primary text / Ops navigation |
| `--night-800` | `#172A31` | Dark brand surface |
| `--night-950` | `#0B171C` | Hero overlay / deepest surface |
| `--moss-600` | `#426759` | Primary action on light |
| `--moss-700` | `#315044` | Primary hover |
| `--copper-500` | `#B66F45` | Accent, selected date/range edge |
| `--sky-600` | `#276B91` | Informational status/link where needed |
| `--success-700` | `#2F6B4F` | Success text/icon |
| `--warning-700` | `#8A5A12` | Warning text/icon |
| `--danger-700` | `#A13D3D` | Error/destructive text/icon |
| `--white` | `#FFFFFF` | Inverse text/surface |

Semantic pairs must be contrast-tested in rendered context. Baselines: primary text on light ≥7:1 target; normal text ≥4.5:1; large text and UI boundaries ≥3:1. Never place essential text directly on uncontrolled photography without a tested scrim or solid panel.

Status palettes have text/icon/border/fill variants. Reservation states also use labels and patterns/icons: Hold (clock), Confirmed (check), In house (key), Checked out (door), Cancelled (slash), No show (alert). Housekeeping uses Dirty (spark/alert), Cleaning (progress), Clean (check), Inspected (shield-check), DND (bell-slash), OOS (wrench).

### Typography

Use license-safe, self-hosted fonts with fallbacks:

- Display/editorial: `Instrument Serif`, Georgia, serif.
- UI/body: `Inter`, system-ui, sans-serif.
- Numeric/tabular: Inter with `font-variant-numeric: tabular-nums`.

| Style | Fluid size | Line height | Notes |
|---|---|---|---|
| Display XL | `clamp(3rem, 7vw, 7rem)` | 0.94 | Stay hero only; ≤12 words |
| Display L | `clamp(2.5rem, 5vw, 5rem)` | 1.0 | Editorial title |
| H1 | `clamp(2rem, 3vw, 3.5rem)` | 1.08 | Public pages |
| Ops H1 | `1.75rem` | 1.2 | Operational page title |
| H2 | `clamp(1.5rem, 2vw, 2.25rem)` | 1.15 | Sections |
| Body L | `1.125rem` | 1.6 | Editorial intro |
| Body | `1rem` | 1.5 | Default |
| UI | `0.875rem` | 1.4 | Tables/forms; never below 14 px |
| Caption | `0.75rem` | 1.45 | Supporting only; not core actions |

Public body line length: 55–72 characters. Ops detail text: 45–80. Sentence case throughout; all-caps is restricted to short decorative overlines with letter spacing and never used for long labels.

### Spacing, grid, shape, elevation

- Base spacing unit: 4 px. Scale: `1=4`, `2=8`, `3=12`, `4=16`, `5=20`, `6=24`, `8=32`, `10=40`, `12=48`, `16=64`, `20=80`, `24=96`.
- Stay layout: 4 columns mobile, 8 tablet, 12 desktop; 16/24/32 px gutters; content max 1280 px, reading max 720 px.
- Ops layout: 4/8/12 columns; 16–24 px gutters; fluid workspace with sensible table minimums.
- Radius: 4 px small controls, 8 px cards/inputs, 16 px sheets, 999 px pills. Avoid excessive pill-shaped containers.
- Borders: 1 px default; 2 px focus/high-emphasis. Shadows are subtle and reserved for overlays/sticky separation.
- Preferred interactive target is 44×44 px. Never fall below WCAG 2.2’s 24×24 px minimum unless the spacing exception is satisfied.

### Motion

- Fast 120 ms, standard 200 ms, deliberate 320 ms; easing `cubic-bezier(.2,.7,.2,1)`.
- Motion explains layer, selection, or progress; no parallax required for comprehension.
- `prefers-reduced-motion: reduce` removes nonessential transforms/autoplay and uses instant/crossfade transitions.
- Gallery video never autoplays with sound; pause control is visible; poster image always exists.

## 3. Voice and content

Public copy is sensory but specific: lead with place and benefit, then facts. Avoid superlative piles, vague exclusivity, artificial countdowns, dark patterns, and false scarcity. Operational copy is direct and uses verb-first actions.

Examples:

- Good public: “A sea-facing suite with a shaded terrace and separate living room.”
- Good operation: “Room 208 is clean, not inspected. Inspect before check-in.”
- Error: “Your card was declined. No charge was made. Try another card or retry.”
- Conflict: “Room 208 was assigned to another stay at 14:32. Choose one of 3 available rooms.”

Dates include day/month/year when ambiguity matters; amounts always include currency; statuses use human-readable labels; do not expose raw enum names.

## 4. Component library

### Foundations

`Logo`, `Icon`, `Text`, `Heading`, `Link`, `Divider`, `AspectRatio`, `VisuallyHidden`, `FocusRing`, `Skeleton`, `Spinner`, `Progress`, `LiveRegion`.

Icons are an original or open-license consistent 1.75 px stroke set. Decorative icons are hidden from assistive technology; functional icon-only buttons have accessible names and tooltips.

### Inputs and actions

- `Button`: primary, secondary, quiet, inverse, destructive; loading keeps width and label context.
- `IconButton`: 44 px preferred target, tooltip, accessible name.
- `TextField`, `TextArea`, `Select`, `Combobox`, `Checkbox`, `RadioGroup`, `Stepper`, `Switch`.
- `DateRangePicker`: typed inputs + calendar dialog/sheet; locale format hint; full keyboard grid; unavailable reasons; selected range and nights announcement.
- `GuestPicker`: adults/children/rooms steppers with capacity messaging; never dropdown-only on mobile.
- `CurrencyInput`, `PhoneInput`, `AddressFields`, `PaymentElement` wrapper.
- Every field has persistent label, optional marker where relevant, hint, error, and valid autocomplete. Placeholder is never the only label.

### Feedback and overlays

`Alert`, `InlineMessage`, `Toast`, `ErrorSummary`, `EmptyState`, `Dialog`, `AlertDialog`, `Drawer`, `Sheet`, `Popover`, `Tooltip`, `Menu`, `CommandPalette`.

- Toasts do not contain the only path to recover or undo a high-impact action.
- Dialog focus enters logically, remains contained, returns to trigger, and closes with Escape unless a transaction is actively committing.
- Confirmation labels state outcome: “Cancel reservation and refund €420,” not “Yes.”

### Public hospitality components

- `StaySearch`: date range + guests/rooms + submit; horizontal desktop, stacked/sheet mobile.
- `EditorialHero`: art-directed media, eyebrow/title/short copy, at most two actions; safe contrast regions.
- `RoomCard`: gallery image, room facts, accessible-features cue, full-stay total, availability state.
- `RateCard`: rate name, inclusions, cancellation/payment policy, total, expandable breakdown, select action.
- `PriceBreakdown`: nightly subtotal, extras, discounts, taxes/fees, paid/due, currency; totals visually and semantically grouped.
- `MediaGallery`: button navigation, count, captions, alt strategy, full-screen dialog, thumbnail alternative.
- `AmenityList`, `AccessibilityFacts`, `PolicySummary`, `OfferCard`, `ExperienceCard`, `MapAndDirections`.
- `BookingStepper`: named steps, current/completed state, no link to inaccessible future step.
- `StaySummary`: dates/nights/party/room/rate/policy/total; sticky desktop, collapsible above form mobile.
- `ConfirmationPanel`: success heading, confirmation number, payment status, next steps; no confetti dependency.

### Ops components

- `AppShell`, `SideNav`, `BottomNav`, `PropertyPicker`, `GlobalSearch`, `BusinessDate`.
- `KpiCard`: definition tooltip, comparison, data freshness, linked drill-down.
- `DataTable`: semantic table, sort labels, selection, density control, column settings, pagination/virtualization, card alternative.
- `FilterBar`/`FilterSheet`: applied chips, count, clear-all, saved views.
- `StatusBadge`: text + icon + semantic tone; never color alone.
- `TimelineGrid`: virtualized rows/columns, date headers, reservation bars, occupancy overlay, conflict indicators; paired `TimelineList` equivalent.
- `ReservationBar`: name/ID, interval, state, source/lock/alerts; focusable and operable without drag.
- `DetailDrawer`, `ActivityTimeline`, `AuditEvent`, `NotesComposer`, `TaskList`.
- `RoomStatusMatrix`: occupancy + condition + operational status in separate columns.
- `HousekeepingCard`: room, service type, condition, occupancy/DND, assignee, priority/SLA, valid next actions.
- `FolioLedger`: semantic line-item table, grouped charges/payments, balance, linked corrections.
- `PaymentStatus`, `InvoicePreview`, `OrderTicket`, `SyncEvent`, `ConflictPanel`, `ChartWithTable`.

## 5. Component state contract

Every async component documents and stories these states:

1. idle/default;
2. hover/focus/pressed/selected/disabled/read-only;
3. loading initial and refreshing;
4. populated;
5. empty first-use and empty filtered;
6. validation and system error;
7. stale/conflict;
8. partial permission;
9. success/undo where safe;
10. offline/pending sync if applicable.

Skeletons mirror final geometry and set `aria-hidden`; one nearby polite live region announces meaningful progress. Disabled actions include a perceivable explanation when users need to understand why.

## 6. Responsive behavior

### Public

- Use mobile-first source order; editorial alternation never changes reading order.
- Search is always visible near page start. On mobile it opens a full-height sheet; selected dates and total return to the trigger summary.
- Room results are one column on mobile, two/three at wider containers. Comparison facts remain in identical order.
- Checkout is one column on mobile; desktop uses form + sticky summary. The summary becomes a disclosure before the form on narrow screens.
- Galleries use responsive `srcset/sizes`, modern formats with fallback, aspect-ratio reservation, and explicit user controls.

### Ops

- Narrow screens prioritize today, arrivals, reservation lookup, room status, and housekeeping tasks; analytics and large configuration tables remain accessible through simplified views.
- Timeline may scroll horizontally because its two-dimensional relationship is meaningful, but List view must complete assignment/move workflows.
- Dense tables switch to prioritized cards or column disclosures below their viable container width.
- Drawers become full-screen sheets. Sticky action bars respect safe areas and do not obscure focus/content.

## 7. Accessibility specification

Target WCAG 2.2 AA for complete processes, not isolated pages.

- Semantic landmarks, logical headings, skip link, unique titles, correct language and language-of-parts.
- Native controls first; ARIA only where semantics require. WAI-ARIA APG interaction is a starting point, followed by real AT testing.
- Visible focus, not obscured by sticky UI; logical focus order; no positive `tabindex`.
- Text contrast ≥4.5:1, large text/UI boundaries ≥3:1; color never sole meaning; Windows High Contrast/forced colors supported.
- Zoom 200% and reflow at 320 CSS px without lost content/function, except meaningful two-dimensional data with equivalent view.
- Keyboard access to all actions, including non-drag move/resize, menus, tabs, dialogs, date range, and charts’ data tables.
- Errors identified in text, tied with `aria-describedby`, summarized and linked; financial submission supports review/correction.
- Live regions announce result counts, date-range selection, cart/total changes, save states, and transaction outcomes without excessive chatter.
- Images use contextual alt; decorative media empty alt; galleries avoid duplicative alt; video has captions/transcript/audio-description plan.
- Forms use `autocomplete`, appropriate input modes, clear required/optional labels, paste-friendly password/payment behavior, and no cognitive-function-only authentication.
- No session loss without warning and extension. Booking draft recovery avoids redundant re-entry.
- Touch gestures have single-pointer alternatives. Orientation is unrestricted.
- Charts pair with summaries and data tables. PDFs/invoices require tagged output or an equivalent accessible HTML invoice.

## 8. Performance and media budgets

- Public initial route JS target ≤170 KB gzip excluding consented third-party payment/map code; Ops initial shell ≤250 KB gzip, with route-level splitting.
- Hero candidate ≤350 KB mobile / ≤700 KB desktop; below-fold images lazy-loaded; no layout shift.
- Self-host fonts, subset, preload only critical roman faces, `font-display: swap`; cap initial font transfer at ~120 KB.
- Third-party scripts default off until required/consented; map loads on interaction with static accessible alternative.
- Test mobile mid-tier device on throttled 4G and desktop; meet LCP ≤2.5 s, INP <200 ms, CLS <0.1 at p75.

## 9. Design QA acceptance

- Token lint prevents raw semantic colors/spacing in product components.
- Component catalog contains all contract states and viewport snapshots.
- No essential information/action is available only by hover, color, animation, drag, or precise pointer movement.
- Public pages pass visual review at 320, 375, 768, 1024, 1440, and 1920 px; Ops additionally at 1280 and 1600 px.
- Light/dark imagery header variants, reduced motion, forced colors, 200/400% zoom, long localization strings, empty/large data, and slow/error states are reviewed.
- Copy and assets pass originality/license review before release.

