# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary User:** Undergraduate and postgraduate university students residing or planning to reside on campus at Lovely Professional University (LPU). Students access the portal primarily on mobile devices over variable hostel Wi-Fi during time-sensitive intake windows, needing an immediate, calm answer to: "Is my room confirmed, and who is my roommate?"
- **Secondary Users:**
  - **Parents and Guardians:** Family or emergency contacts listed on student profiles who provide required parent consent (`parent_consent_at`) on overnight/leave outing gate passes (`GatePassWidget`).
  - **Hostel Wardens:** Desktop-first residential faculty and staff overseeing assigned complexes (e.g., BH-1, GH-1), handling occupancy reviews, conflict and swap exception queues, outing gate pass verification, maintenance escalation tracking, and delegated allocation approvals.
  - **University Administrators and Registrar:** Institutional authorities managing intake cycles, campus-wide bed capacity, student registry reconciliation, audit logs, and electrical overage accounting.

## Product Purpose

Provide a transparent, calm university residential and living portal that removes guesswork, manual paperwork, and roommate uncertainty. Success means a student immediately sees their position across the allocation lifecycle (`Eligible -> Choices (max 3) -> Under Review -> Allocated -> Roommate -> Fee -> Confirmed`), inspects tower floors and rooms cleanly before selecting up to three ordered choices, calculates 10-month EDB and dining fees, finds an aligned roommate without exposing private details before mutual acceptance, and manages outing gate passes and maintenance tickets after move-in.

## Positioning

Unlike generic hotel or property booking software, this system models university residential governance and campus workflows:
1. **Prioritized Intake Engine:** Students inspect tower blueprints and submit up to 3 ordered hostel/room choices reviewed and allocated by residential governance, rather than an unguided lottery.
2. **Algorithmic Lifestyle Compatibility:** Deterministic 7-factor roommate matching (sleep schedule 22%, cleanliness 17%, study habits 17%, noise tolerance 11%, dietary 11%, social 11%, AC temperature 11%; zero smoking fields) with same-gender isolation and mutual consent before sharing personal details or forming a group.
3. **Transparent Academic Session Economics:** 10-month tariff breakdown covering standard vs. Early Decision Benefit (EDB ₹10,000) rates, room electricity allowances (250 to 1,000 kWh), and Pro Bricks dining plan ratios.
4. **Integrated Campus Living Operations:** Delegated warden approvals, parent-consented outing gate passes, and SLA-tracked maintenance ticketing inside one unified portal.

## Operating Context

- **Academic Cycles:** Intake cycles synchronized with university semesters (for example Academic Year 2026-27).
- **Physical Environment:** Campus -> Hostel Complex -> Block -> Floor -> Room -> Bed hierarchy across Boys (`BH-1` to `BH-8`) and Girls (`GH-1` to `GH-6`) complexes.
- **Pro Bricks Centralized Dining (`views_living.py`):** Six regional Indian cuisines: North Indian Royal Feast (₹4,500/mo), South Indian Traditional (₹4,400/mo), Rajasthani Marwari Thali (₹4,600/mo), Kathiyawadi & Gujarati Sattvik (₹4,400/mo), Haryanvi Desi Diet (₹4,600/mo), and Eastern & Bengali Coastal (₹4,800/mo), paired with 4 Meals (100%), 3 Meals (85%), or 2 Meals (65%) meal plan multipliers.
- **Regulatory & Appliance Policy *(unverified, confirm with warden/DSA)*:** No policy table or backend rule source currently exists in the codebase. Until confirmed with the hostel warden and Division of Student Affairs (DSA), treat immersion heating rods, induction cooktops, space heaters, and electric irons as prohibited everywhere across the UI from one shared constants file (`hostelRules.ts`). Permitted-appliance exceptions are omitted until an authoritative policy source is confirmed; do not invent other hostel rules.
- **Production Runtime Boundaries:** React/Vite TypeScript SPA frontend hosted on Vercel communicating with a Django API on Railway backed by Supabase PostgreSQL.

## Capabilities and Constraints

- **Student Allocation Flow (Existing Application Engine):** Follow the existing intake engine: `Eligible -> Choices (max 3) -> Under Review -> Allocated -> Roommate -> Fee -> Confirmed`. Submissions transition through auditable backend states (`SUBMITTED`, `UNDER_REVIEW`, `ALLOCATED`, `WAITLISTED`, `CANCELLED`). Because no backend payment settlement or post-fee check-in confirmation model exists yet, UI stage rails must display `Fee` and `Confirmed` honestly as `Not tracked yet` rather than simulating progress.
- **CAD Floor Inspector & Choice Picking:** `ArchitecturalFloorPlan` and `RoomInspectionModal` let students inspect wings, rooms, vacancies, and fees, then select a room/tower to populate Priority Choice #1-#3 on `/apply`. *(Note: No Three.js or React Three Fiber package exists in `frontend/package.json` yet; planned 3D bed/room viewing must ship 2D floor-plan inspection first with graceful fallback.)*
- **Future Locking Scope (Not in v1):** Server-backed real-time bed locking and temporary hold timers do **not** exist in the backend. Never implement optimistic client-only locks or v1 hold countdown bars; treat real-time bed locking strictly as a future backend+frontend feature.
- **Room Configurations:** 1 to 8-seaters across Standard Rooms, Studio Apartments (pantry + attached washroom), and Dormitories (common washroom); Air-Conditioned (AC) vs. Air-Cooled; 250 kWh to 1,000 kWh 10-month electricity quotas.
- **Roommate Matching Engine:** 7-factor weighted preferences (`sleeping_schedule`, `cleanliness`, `study_habits`, `noise_tolerance`, `food_preference`, `social_preference`, `temperature_pref`), direct Student Roll ID lookup, ranked candidate recommendations returning overall compatibility percentage (`score`) and `is_room_aligned` (per-factor breakdown and dealbreakers do not exist in the API yet), plus mutual invitation acceptance before forming a group bounded by target room capacity. Personal phone numbers and private contact details remain hidden until mutual acceptance.
- **Digital Outing Gate Passes (`GatePassWidget` / `/api/gatepass/`):** `DAY_PASS`, `NIGHT_OUT`, `LEAVE`, and `EMERGENCY` workflows tracking parent consent (`parent_consent_at`), warden review, exit/return timestamps, and QR tokens.
- **Room Maintenance & SLA Tickets (`RMSDeskWidget` / `/api/rms/tickets/`):** Trade-categorized repair tracking matching `backend/apps/hostels/models.py` (`PLUMBING`, `ELECTRICAL`, `WIFI_LAN`, `CARPENTRY`, `APPLIANCE`, `PEST_CONTROL`) with SLA deadlines and escalations.
- **Residential Economics Calculator (`EconomicsCalculatorModal` / `/api/economics/calculator/`):** Calculates 10-month room tariff, EDB discount, Pro Bricks dining plan cost, and kWh overage estimates.
- **Warden Command Center (`WardenCommandCenter`):** Desktop-first tower-scoped operations desk for monitoring complex census, outing pass sign-offs, maintenance SLA queues, and delegated approvals.
- **Security & Authorization:** Session-based authentication (Student ID or `@lpu.in` email), CSRF enforcement, and strict Role-Based Access Control (`STUDENT`, `WARDEN`, `ADMIN`).

## Brand Commitments

- **Institutional Identity:** Campus housing portal for Lovely Professional University (LPU). *(Color tokens, typography, borders, and layout geometry are specified strictly in `DESIGN.md`, not here.)*
- **Copy Voice & Rules:** Plain, calm, notice-board and university-handbook prose. Never use exclamation marks, playful or apologetic error phrasing ("Oops"), emoji navigation icons, invented statistics or testimonials, or em dashes in UI copy.

## Demo and Seeded Data

*(All inventory figures, fee numbers, dining rates, and sample student profiles below are seeded demo data generated by `backend/apps/hostels/management/commands/seed_demo_data.py` and `backend/apps/api/views_living.py`, not confirmed LPU figures.)*
- **Seeded Campus Inventory:** 14 sample residential towers (`BH-1` to `BH-8`, `GH-1` to `GH-6`), 476 rooms, and 1,858 beds across varied capacity/cooling tiers.
- **Sample Tariff & Dining Fixtures:** Pre-configured 10-month sample fee tiers (with ₹10,000 EDB delta and 250–1,000 kWh sample quotas) plus the 6 regional cuisine monthly reference rates in `views_living.py`.
- **Demo Accounts & Student Cohort:** Pre-seeded student, warden, and admin registry records across engineering and sciences departments for sandbox testing and verification.

## Product Principles

1. **Answer Status Before Choices:** Lead student screens with clear current allocation status, stage position, and next action rather than promotional framing.
2. **Truthful Server State Over Optimism:** Reflect real backend application states and room inventory cleanly without simulating unavailable locks or unverified policy claims.
3. **Consent & Privacy First:** Withhold personal peer contact details until mutual roommate acceptance and require parent/warden approvals along documented gate-pass state boundaries.
4. **Resilient Across Devices:** Keep student allocation journeys fast on mobile devices over slow hostel Wi-Fi while making warden operational tables dense and keyboard-efficient on desktop.

## Accessibility & Inclusion

- Meet WCAG 2.1 AA contrast ratios (>= 4.5:1 for body text) with crisp visible keyboard focus rings.
- Enforce minimum 44px touch targets for mobile selection and confirmation controls.
- Pair every status state (`Available`, `Locked`, `Taken`, `Yours`) with an explicit text label and distinct icon or pattern rather than color alone, and respect `prefers-reduced-motion`.
