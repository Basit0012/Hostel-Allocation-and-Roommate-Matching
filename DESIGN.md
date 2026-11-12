---
colors:
  background: '#FFFFFF'
  surface: '#FAFAFA'
  primary: '#18181B'
  accent: '#84CC16'
  accent-ink: '#3F6212'
  muted: '#52525B'
  border: '#E4E4E7'
  dark-background: '#09090B'
  dark-surface: '#111113'
  dark-primary: '#FAFAFA'
  dark-accent: '#A3E635'
  dark-border: '#27272A'
typography:
  display: 'Schibsted Grotesk'
  body: 'Schibsted Grotesk'
  mono: 'JetBrains Mono'
rounded:
  card: '12px'
  button: '8px'
  badge: '9999px'
  input: '8px'
spacing:
  unit: '4px'
  density: 'compact'
components:
  - CollapsibleSidebarShell
  - CommandSearch
  - ContinuousTabs
  - CardSplitAccordion
  - StepIndicatorStageRail
  - InlineTableControl
---

# Design System: LPU Campus Residence Portal (Watermelon UI)

## Overview

The LPU Campus Residence Portal adopts **Watermelon UI** (`ui.watermelon.sh`) architecture: a high-craft neutral workspace built on crisp white (`#FFFFFF`) and zinc-neutral surfaces (`#FAFAFA`) with seamless Dark mode (`#09090B` / `#111113`), hairline borders (`1px solid`), a collapsible workspace sidebar, `Command-K` quick search, and purposeful spring physics via `motion/react` (`MotionConfig reducedMotion="user"`).

All domain rules from `PRODUCT.md` remain strictly enforced:
- **Student Flow (No v1 Locking):** The student workflow uses the existing application engine with up to 3 prioritized choices (`Eligible -> Choices (max 3) -> Under Review -> Allocated -> Roommate -> Fee -> Confirmed`), NOT first-come bed locking. Do not render sticky lock bars or hold countdown timers in v1.
- **Backend-Driven Honesty:** `Fee` and `Confirmed` are rendered explicitly as `"Not tracked yet"` because backend models do not expose fee settlement or check-in confirmation yet.
- **Roommate UI Contract:** Shows only real fields returned by `/api/roommates/discover/` and `/api/roommates/group/` (7 factors combined into overall compatibility `score`, `is_room_aligned`, `target_room`, `selected_room`, `has_pending_request`, `student_id`, `full_name`, `branch`, `cgpa`). Never invent per-factor breakdown bars or dealbreaker pills.
- **RMS Categories & Rules:** Trade categories strictly mirror `RMSTradeCategoryChoices` in `backend/apps/hostels/models.py` (`PLUMBING`, `ELECTRICAL`, `WIFI_LAN`, `CARPENTRY`, `APPLIANCE`, `PEST_CONTROL`). Prohibited appliances (`hostelRules.ts`) stay labeled `unverified, confirm with warden/DSA`.
- **Copy Discipline:** Zero em dashes, zero exclamation marks, zero emoji icons, zero lorem ipsum, zero invented statistics.

## Colors

Tokens support Light (`:root`) and Dark (`.dark` / `[data-theme="dark"]`) modes, mapped into Tailwind CSS v4 `@theme inline` custom properties:

| Token | Light | Dark | Contrast Role |
| :--- | :--- | :--- | :--- |
| `--background` | `#FFFFFF` | `#09090B` | Main canvas (`19.90:1` light / `19.06:1` dark with `--foreground`) |
| `--card` / `--surface` | `#FAFAFA` | `#111113` | Sidebar rail & card surfaces |
| `--muted` | `#F4F4F5` | `#18181B` | Hover rows, input tracks, segmented tab shells |
| `--foreground` | `#09090B` | `#FAFAFA` | Primary ink & active controls |
| `--muted-foreground` | `#52525B` | `#A1A1AA` | Secondary captions & labels (`7.73:1` light / `7.76:1` dark) |
| `--primary` | `#18181B` | `#FAFAFA` | Primary action fill (`16.97:1` light / `19.06:1` dark) |
| `--primary-foreground` | `#FAFAFA` | `#09090B` | Label text inside primary controls |
| `--accent-brand` | `#84CC16` | `#A3E635` | Watermelon signature lime ring, active badge fill (`#09090B` ink -> `10.07:1`) |
| `--accent-text` | `#3F6212` | `#A3E635` | Inline lime text on canvas/soft pill (`7.08:1` light / `13.19:1` dark) |
| `--border` | `#E4E4E7` | `#27272A` | 1px structural hairlines |
| `--destructive` | `#B91C1C` | `#FCA5A5` | Error/rejected states (`5.30:1` light / `8.51:1` dark on soft badge) |

Status badges must always pair color with icon + clear uppercase label (color is never the sole indicator).

## Typography

Fonts are self-hosted via `@fontsource` (subsetted Latin `.woff2`, `font-display: swap`), with zero Google Fonts network requests:
- **Sans / UI:** `Schibsted Grotesk` (400, 500, 600, 700)
- **Monospace / IDs / Rooms / Metrics:** `JetBrains Mono` (400, 500, 600)

Scale uses tight tracking (`-0.025em`) on page headings, `tabular-nums` on room codes, vacancy figures, scores, and fee references, and `>= 12px` body/label sizing across desktop and `360px` mobile.

## Layout

- **App Shell:** Collapsible left workspace sidebar (`240px` expanded / `64px` collapsed on desktop; slide-over drawer + compact mobile bottom bar at `360px`–`767px`), sticky `56px` workspace header with page breadcrumb, centered **Command-K Search** trigger (`⌘K` / `F` / button), and Light/Dark theme switch.
- **Responsive Breakpoints:** Mobile-first `360px` single-column stack (`px-4`), expanding into structured bento/split rails on `md` (`768px`) and `xl` (`1280px`) viewports without horizontal overflow.

## Elevation & Depth

Minimalist hairline architecture inspired by Watermelon UI:
- Primary hierarchy relies on tonal separation (`#FFFFFF` vs `#FAFAFA` / `#09090B` vs `#111113`) and `1px solid var(--border)` strokes rather than heavy drop shadows.
- Floating overlays (Command Search dialog, mobile drawer, tooltips) use crisp `1px` borders plus subtle ambient shadow (`0 24px 48px -12px rgb(0 0 0 / 0.14)`).

## Shapes

- Outer workspace containers & modal shells: `16px` (`rounded-2xl`)
- Standard cards, split accordion tiles, tables: `12px` (`rounded-xl`)
- Buttons, inputs, command rows, sidebar active items: `8px` (`rounded-lg`)
- Status pills & compact indicators: `9999px` (`rounded-full`)

## Components

1. **`CollapsibleSidebarShell` + Workspace Header:** Persistent navigation grouped under `Workspace` (`Student Home`, `Dashboard`) and `Residence` (`Hostel Explorer`, `Room Catalog`, `Roommate Match`, `Priority Application`).
2. **`CommandSearch`:** Watermelon animated `layoutId` search bar & floating command palette filtering routes, hostel blocks, and theme/simulator shortcuts (`Esc` to close, arrow keys + `Enter` to run).
3. **`StepIndicatorStageRail`:** Interactive 7-stage progress rail (`Eligible` to `Confirmed`) backed strictly by real backend `Application` and `RoommateGroup` state, with `"Not tracked yet"` for `Fee` and `Confirmed`.
4. **`ContinuousTabs`:** Spring-driven (`stiffness: 380, damping: 30, mass: 0.9`) segmented tab selector with animated `layoutId` pill for reference fee tiers (`Sample Room Tiers`, `Dining Plans`, `Fee Notes`).
5. **`CardSplitAccordion`:** Tactile spring accordion (`useMeasure` + rounded corner separation on open) displaying campus policy rules (`hostelRules.ts`, explicitly marked `unverified, confirm with warden/DSA`) and allocation notes.
6. **`InlineTableControl`:** Responsive table control with inline spring editing/action rows for warden command desk & room lists.

## Do's and Don'ts

- **Do** preserve all Light & Dark WCAG AA (`>= 4.5:1`) pairs (`#09090B` text on `#84CC16` lime fills, `#3F6212` for lime text links on `#FFFFFF`).
- **Do** wrap `motion/react` animations inside `<MotionConfig reducedMotion="user">`.
- **Don't** put white text on `#84CC16` lime backgrounds (fails contrast).
- **Don't** invent lock bars, hold timers, payment states, or per-factor roommate match percentages that the backend does not return.
- **Don't** use external Google Fonts requests, emoji icons, exclamation marks, or em dashes.
