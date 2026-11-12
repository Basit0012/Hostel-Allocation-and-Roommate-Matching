# Software Requirements Specification (SRS)
## Smart Hostel Allocation & Algorithmic Roommate Matching Platform
### Standard University Enterprise Edition (LPU Campus Operational Standard)

---

**Document Reference:** LPU-SRS-2026-REV2  
**Document Version:** 2.0.0 (Production Master)  
**Status:** Approved & Implemented  
**Date:** November 2026  
**Engineering Stack:** React 18 / TypeScript / Vite / Tailwind CSS / Django 6.1 / Python 3.13 / PostgreSQL (Supabase) / Gunicorn / WhiteNoise / Vercel Edge Proxy

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the authoritative functional, behavioral, mathematical, and non-functional requirements for the **Smart Hostel Allocation and Roommate Matching Platform**. It serves as the primary technical specification for developers, quality assurance engineers, system architects, university registrars, and evaluating academic panels.

### 1.2 Document Conventions
- Requirements labeled **[MANDATORY / SHALL]** define non-negotiable core functionality.
- Requirements labeled **[SHOULD]** represent standard production enhancements.
- Requirements labeled **[MAY]** designate optional or role-delegated features.
- All mathematical formulas follow standard LaTeX notation.

### 1.3 Intended Audience
- **Software Engineers & Full-Stack Developers:** Backend ORM logic, REST APIs, frontend state management, database schema.
- **QA Automation Engineers:** Test matrices, end-to-end browser assertions, concurrency stress testing.
- **University Administrators & Wardens:** Residential policies, hostel hierarchy, intake cycles, gate pass approvals, maintenance workflows.
- **Academic Evaluation Committees:** Algorithmic transparency, data safety, transaction isolation, architectural integrity.

### 1.4 Product Scope & Problem Definition
Traditional university hostel allotment is plagued by chaotic first-come-first-served stampedes, random roommate pairings resulting in lifestyle incompatibility, paper-based gate passes prone to tampering, and unmonitored room maintenance. 

This platform provides an integrated, end-to-end digital ecosystem that:
1. Validates student identities against pre-enrolled university registries.
2. Evaluates roommate compatibility using a transparent, deterministic 7-factor mathematical model (zero black-box ML).
3. Enforces a **Mutual Room Alignment Invariant** ensuring roommate groups agree on identical rooms before pairing.
4. Executes bed allocations inside atomic transactions with **pessimistic row-level locking (`SELECT FOR UPDATE`)** to permanently prevent double-allocations during concurrency rushes.
5. Manages residential operations through a multi-stage **Digital Gate Pass** state machine with dynamic QR verification and an SLA-tracked **Relationship Management System (RMS)** for campus maintenance.
6. Implements Lovely Professional University (LPU) 10-month academic session fee structures, Early Decision Benefit (EDB) pricing, and equitable per-room electricity quota overage division.

### 1.5 Definitions, Acronyms, and Abbreviations
- **ACID:** Atomicity, Consistency, Isolation, Durability.
- **CAD:** Computer-Aided Design (referring to 2D architectural blueprint floor plans).
- **CORS:** Cross-Origin Resource Sharing.
- **CSRF:** Cross-Site Request Forgery.
- **DRF:** Django REST Framework.
- **EDB:** Early Decision Benefit (flat ₹10,000 university lodging fee deduction).
- **FSM:** Finite State Machine.
- **KPI:** Key Performance Indicator.
- **NFR:** Non-Functional Requirement.
- **RBAC:** Role-Based Access Control.
- **RMS:** Relationship Management System (Campus Facility Maintenance).
- **SLA:** Service Level Agreement.
- **SPA:** Single Page Application.

---

## 2. Overall Description

### 2.1 Product Perspective & System Context
The platform operates as a decoupled, modern cloud-native web architecture:
- **Client Layer:** React 18 Single Page Application (TypeScript, Tailwind CSS, Material 3 / Watermelon Design System, Vite).
- **Edge Gateway:** Vercel reverse proxy rewriting `/api/*` and `/admin/*` to backend endpoints to ensure first-party cookie context.
- **Backend Application Server:** Django 6.1 WSGI Monolith running under Gunicorn with WhiteNoise static asset compression on Railway.
- **Persistence Layer:** PostgreSQL 15+ hosted on Supabase (with SQLite support for local dev/testing), featuring transactional row-locking and strict foreign keys.

```
+-------------------------------------------------------------------------+
|                  Client Web Browser (Desktop / Mobile)                 |
|             React 18 SPA (TypeScript + Tailwind CSS + Lucide)           |
+------------------------------------+------------------------------------+
                                     | HTTPS (Port 443)
                                     v
+------------------------------------+------------------------------------+
|                         Vercel Edge Proxy                               |
|        - CDN Static Hosting        - Rewrite /api/* -> Railway          |
|        - SPA Routing Fallback      - Rewrite /admin/* -> Railway        |
+------------------------------------+------------------------------------+
                                     | HTTPS Reverse Proxy
                                     v
+------------------------------------+------------------------------------+
|                   Railway Container (Gunicorn WSGI)                     |
|  - Django 6.1 Application Core     - WhiteNoise Static Compression      |
|  - Custom Auth Backend             - 7-Factor Deterministic Matcher     |
|  - Transactional Allocation Engine - Gate Pass & RMS State Machines     |
+------------------------------------+------------------------------------+
                                     | PostgreSQL TCP / Pooler (Port 6543)
                                     v
+------------------------------------+------------------------------------+
|                   Supabase PostgreSQL 15+ Database                      |
|  - Pessimistic Row Locking         - ACID Foreign Key Constraints       |
|  - Unique Allocation Constraints   - Immutable Audit Logs               |
+-------------------------------------------------------------------------+
```

### 2.2 User Roles and Responsibilities (RBAC)

The system enforces strict Role-Based Access Control across 4 operational personas:

| Role | Scope & Permissions | Key Interfaces |
| :--- | :--- | :--- |
| **Student (`STUDENT`)** | Self-service access. Verifies identity against `StudentRegistry`, submits 7-factor lifestyle traits, searches candidate peers, sends/accepts roommate requests, submits dual-choice room applications, views allocation status, requests Digital Gate Passes, and files RMS tickets. | `/dashboard`, `/roommates`, `/apply` |
| **Hostel Warden (`WARDEN`)** | Scoped oversight of assigned hostel towers. Accesses the Warden Command Center, tracks complex census metrics, reviews and approves/rejects Gate Passes, dispatches caretakers for RMS maintenance tickets, and inspects architectural CAD floor plans. | `/dashboard` (Warden Command Center) |
| **University Administrator (`ADMIN`)** | Global governance. Full control over academic batches, student registries, hostel blocks, room catalogs, fee schedules, warden assignments, and allocation cycles. Direct access to the live Django Administration Console (`/admin/`). | `/dashboard` (Admin Badge), `/admin/*` |
| **Unauthenticated Visitor** | Public discovery. Browses hostel facilities, reviews room capacities and cooling types, inspects 2D floor plans, explores fee structures via the Economics Calculator modal, and accesses registration/login portals. | `/`, `/hostels`, `/hostels/:id`, `/rooms`, `/login`, `/register` |

### 2.3 Operating Environment & Deployment Targets
- **Server OS:** Ubuntu Linux 22.04 LTS (Containerized via Docker / Railway).
- **Python Runtime:** Python 3.13.x.
- **Node Runtime:** Node.js 20.x+ (Vite build engine).
- **Database Engine:** PostgreSQL 15+ (Production) / SQLite 3.40+ (Isolated QA).
- **Client Browsers:** Modern evergreen browsers (Chrome 120+, Safari 17+, Firefox 120+, Edge 120+) across desktop (`1440×900`) and mobile (`360×800` viewport emulation).

### 2.4 Design and Implementation Constraints
1. **Zero Black-Box AI/ML:** Roommate matching MUST be mathematically deterministic, reproducible, auditable, and symmetric in pure Python.
2. **Pessimistic Locking:** Bed assignments MUST use database-level row locking (`SELECT FOR UPDATE`) to prevent race conditions.
3. **Mutual Agreement Invariant:** Roommate groups SHALL NOT form unless both students have chosen the identical room in their active applications.
4. **Strict Gender Isolation:** Roommate requests and hostel room allocations SHALL strictly enforce matching between students of the same verified registry gender.
5. **No Third-Party Cookie Dependency:** All authentication cookies MUST be first-party through reverse proxy routing.

---

## 3. Data Models & System Architecture

### 3.1 Domain Entity Relationships
```
[University] 1---* [Department] 1---* [DegreeProgram] 1---* [Branch] 
                                                                 |
[AdmissionBatch] 1-----------------------------------------------+
       |
       *--- [StudentRegistry] 1---1 [User] 1---1 [StudentProfile]
                                                        |
       +------------------------------------------------+--------------------------------+
       |                                                |                                |
       *                                                *                                *
[RoommatePreference]                            [HostelApplication]              [Allocation]
       |                                                |                                |
       *                                                *                                *
[MatchScore]                                   [ApplicationChoice] 1---*               [Bed]
                                                        |                                |
[Hostel] 1---* [HostelBlock] 1---* [Floor] 1---* [Room] ---------------------------------+
       |
       *--- [WardenAssignment] *---1 [User(WARDEN)]
```

### 3.2 Core Model Entities
1. **`StudentRegistry` (Academic Source of Truth):**
   - Fields: `student_id` (Unique, Primary Roll ID), `full_name`, `institutional_email`, `gender`, `date_of_birth`, `branch`, `batch`, `enrollment_status`.
2. **`User` (Authentication):**
   - Fields: `email` (Unique), `student_id_login` (Indexed), `role` (`STUDENT`, `WARDEN`, `ADMIN`), `is_active`, `is_staff`, `password` (PBKDF2 SHA-256).
3. **`Hostel`, `Room`, `Bed` (Physical Inventory):**
   - `Hostel`: `code`, `name`, `gender_policy` (`MALE`, `FEMALE`, `CO_ED`), `total_capacity`.
   - `Room`: `room_number`, `capacity` (1 to 8), `category` (`STANDARD`, `STUDIO_APARTMENT`, `DORMITORY`), `is_air_conditioned`, `cooling_type`, `status` (`AVAILABLE`, `OCCUPIED`, `FULL`, `MAINTENANCE`), `standard_fee`, `edb_fee`, `quota_kwh`.
   - `Bed`: `bed_identifier` (`A`, `B`, `C`, `D`), `status` (`VACANT`, `OCCUPIED`, `RESERVED`, `MAINTENANCE`).
4. **`RoommatePreference` & `MatchScore`:**
   - 7 lifestyle scores (1–5 scale), `food_preference` (`VEGETARIAN`, `NON_VEGETARIAN`, `FLEXIBLE`), cached pairwise match scores.
5. **`HostelApplication` & `ApplicationChoice`:**
   - `student`, `cycle`, `status` (`DRAFT`, `SUBMITTED`, `ALLOCATED`, `WAITLISTED`, `REJECTED`, `CANCELLED`), up to 3 prioritized choices with target hostel and preferred room.
6. **`Allocation` & `AllocationHistory`:**
   - `student`, `bed`, `application`, `cycle`, `allocated_by`, `start_date`, `end_date`, `is_active`, immutable audit log.
7. **`GatePass` & `RMSTicket`:**
   - `GatePass`: `pass_type` (`DAY_PASS`, `OUTSTATION_PASS`, `EMERGENCY_LEAVE`), `status` (FSM transitions), `qr_token` (UUID4).
   - `RMSTicket`: `ticket_number`, `trade_category`, `priority`, `status`, `sla_deadline`, `is_escalated`.

---

## 4. Detailed Functional Requirements

### 4.1 Module 1: Student Registry & Identity Verification
- **FR-01.1 (Authoritative Registry):** The system SHALL maintain a pre-seeded `StudentRegistry` table representing enrolled university students.
- **FR-01.2 (Account Claim):** A student SHALL be allowed to create an account only by supplying a registered `student_id` and matching `institutional_email`.
- **FR-01.3 (Single Claim Invariant):** Each registry record SHALL link to at most one user account. Subsequent claim attempts SHALL return HTTP 400 (`"An account has already been registered for this Student ID."`).
- **FR-01.4 (Guardian Data Capture):** Upon claiming, the registration form SHALL capture `emergency_contact_name` and `emergency_contact_phone`.
- **FR-01.5 (Phone Format Sanitization):** Emergency phone numbers SHALL be validated against regex `^\+?[0-9]{10,15}$`. Invalid numbers SHALL be rejected with HTTP 400.
- **FR-01.6 (Password Complexity):** Passwords SHALL require at least 8 characters, non-numeric content, and non-trivial dictionary similarity. Validation errors SHALL be returned as granular field-level messages.
- **FR-01.7 (Atomic Activation & Login):** Successful registration SHALL atomically create the `User` and `StudentProfile`, mark the registry claimed, and log the student in using `apps.accounts.backends.EmailOrStudentIDBackend`.

### 4.2 Module 2: Authentication & Session Management
- **FR-02.1 (Dual Identifier Sign-In):** The login endpoint SHALL accept either the student's official University Student ID (e.g., `12400001`) or their institutional email address (e.g., `arjun.sharma@lpu.in`).
- **FR-02.2 (Session Persistence):** Authenticated sessions SHALL use encrypted HTTP-only session cookies with automatic token renewal and sliding expiry.
- **FR-02.3 (CSRF Protection):** All mutating requests (`POST`, `PUT`, `DELETE`) SHALL enforce CSRF validation using the `csrftoken` cookie and `X-CSRFToken` request header.
- **FR-02.4 (Route Protection):** Unauthenticated requests to protected endpoints (`/dashboard`, `/roommates`, `/apply`) SHALL redirect to `/login`.
- **FR-02.5 (Role Segregation):** Students attempting to access staff endpoints or staff attempting to access student-only workflows (`/roommates`, `/apply`) SHALL be redirected safely to `/dashboard` without console errors.

### 4.3 Module 3: Campus Inventory & 2D CAD Blueprint Inspection
- **FR-03.1 (Hostel Directory):** The system SHALL display all 14 campus residential towers (`BH-1..BH-8`, `GH-1..GH-6`) with live occupancy metrics, gender policy badges, and price ranges.
- **FR-03.2 (Complex Filtering):** Users SHALL be able to filter hostels by gender policy (`Boys`, `Girls`), status, and live search query.
- **FR-03.3 (2D Blueprint Viewer):** For each hostel, the system SHALL render interactive CAD blueprint layouts with Block (`Block A`, `Block B`) and Floor (`Floor 1`, `Floor 2`) navigation.
- **FR-03.4 (Bed State Indicators):** The blueprint SHALL visually distinguish beds: `Vacant` (emerald), `Occupied` (zinc/slate), `Reserved` (amber).
- **FR-03.5 (Seamless Application Handoff):** Selecting an available bed on the blueprint and clicking `Proceed with Bed X & Apply` SHALL navigate to `/apply?room=<id>&bed=<id>`, pre-locking the selected room as Choice #1.
- **FR-03.6 (Debounced Room Search):** The room catalog search input SHALL use a 200ms debounce and `AbortController` to cancel superseded HTTP requests and eliminate race conditions.

### 4.4 Module 4: 7-Factor Roommate Compatibility Matching Algorithm
- **FR-04.1 (7 Core Dimensions):** The compatibility engine SHALL calculate compatibility based strictly on 7 normalized lifestyle dimensions:
  1. **Sleeping Schedule ($W_1 = 0.22$):** Scale 1 (Early Bird) to 5 (Night Owl).
  2. **Cleanliness Habits ($W_2 = 0.17$):** Scale 1 (Relaxed) to 5 (Meticulous).
  3. **Study Environment ($W_3 = 0.17$):** Scale 1 (Absolute Silence) to 5 (Group/Music).
  4. **Noise Tolerance ($W_4 = 0.11$):** Scale 1 (Very Low) to 5 (High).
  5. **Dietary Habits ($W_5 = 0.11$):** Categorical (`VEGETARIAN`, `NON_VEGETARIAN`, `FLEXIBLE`).
  6. **Social Preference ($W_6 = 0.11$):** Scale 1 (Private Retreat) to 5 (Frequent Host).
  7. **Thermal Tolerance ($W_7 = 0.11$):** Scale 1 (Low Temp / AC) to 5 (Warm / Fan Only).
- **FR-04.2 (Ordinal Normalization Formula):** For ordinal factors (1–5 scale), the normalized similarity $s_i$ SHALL be computed as:
  $$s_i(x_A, x_B) = 1.0 - \frac{|x_A - x_B|}{4.0}$$
- **FR-04.3 (Dietary Similarity Formula):** For dietary preferences, the similarity $s_{\text{food}}$ SHALL be computed as:
  $$s_{\text{food}}(\text{food}_A, \text{food}_B) = \begin{cases} 
  1.0 & \text{if } \text{food}_A = \text{food}_B \\
  0.8 & \text{if either is } \text{FLEXIBLE} \\
  0.0 & \text{if } \text{VEGETARIAN} \leftrightarrow \text{NON\_VEGETARIAN}
  \end{cases}$$
- **FR-04.4 (Composite Percentage Formula):** The overall compatibility percentage SHALL be:
  $$\text{Compatibility}(A, B) = \left( \sum_{i=1}^{7} W_i \cdot s_i \right) \times 100\%$$
- **FR-04.5 (Mathematical Symmetry):** The algorithm SHALL guarantee symmetry: $\text{Compatibility}(A, B) \equiv \text{Compatibility}(B, A)$.
- **FR-04.6 (Cached Canonical Keying):** Match scores SHALL be cached in `MatchScore` using canonical ordering ($A.\text{pk} < B.\text{pk}$) to avoid redundant recalculations.

### 4.5 Module 5: Roommate Requests & Mutual Room Alignment Engine
- **FR-05.1 (Peer Discovery & Exact Lookup):** Students SHALL be able to browse ranked peer recommendations or search specifically by Student ID (`/api/roommates/discover/?q=<id>`).
- **FR-05.2 (Same-Gender Validation):** Roommate requests between students of different verified registry genders SHALL be rejected immediately with HTTP 400.
- **FR-05.3 (Request Lifecycle):** Requests SHALL transition through `PENDING` $\to$ `ACCEPTED`, `REJECTED`, or `CANCELLED`.
- **FR-05.4 (Mutual Room Alignment Invariant):** When Student B accepts a roommate request from Student A, the system SHALL assert that **both students selected the exact same target room** in their application choices. If room preferences differ, acceptance SHALL be blocked with HTTP 400:
  > *"Mutual room alignment failed: Both students must select a preferred room in their application before forming a roommate group."*
- **FR-05.5 (Capacity Limits):** Roommate groups SHALL NOT exceed the physical bed capacity of the agreed target room (2 to 4 beds).

### 4.6 Module 6: Accommodation Applications & Priority Choices
- **FR-06.1 (Intake Cycle Control):** Applications SHALL be accepted only during an active `AccommodationCycle`.
- **FR-06.2 (One Application Limit):** A student SHALL submit at most one application per academic cycle.
- **FR-06.3 (Dual Preference Choices):** The application builder SHALL support submitting Priority 1 and Priority 2 choices specifying Hostel, Block, Room, and Bed.
- **FR-06.4 (Block Disambiguation):** Room selection dropdowns SHALL explicitly display block identifiers (e.g., `Room 103 · Block A` vs `Room 103 · Block B`).
- **FR-06.5 (Status History):** Application status transitions SHALL be tracked with timestamps (`SUBMITTED`, `UNDER_REVIEW`, `ALLOCATED`, `WAITLISTED`).

### 4.7 Module 7: Transactional Bed Allocation Engine (`SELECT FOR UPDATE`)
- **FR-07.1 (Pessimistic Concurrency Locking):** Bed assignment SHALL execute inside `transaction.atomic()` using `Bed.objects.select_for_update()` to prevent double-booking race conditions during simultaneous application approvals.
- **FR-07.2 (Automated Bed Assignment):** The engine SHALL check the student's Priority 1 choice. If a vacant bed exists in the chosen room, it is locked, marked `OCCUPIED`, and linked to the `Allocation`.
- **FR-07.3 (Priority Fallback):** If Priority 1 is full, the engine SHALL fall back to Priority 2; if all choices are exhausted, the application status SHALL update to `WAITLISTED`.
- **FR-07.4 (Atomic Collective Group Placement):** For confirmed roommate groups, the engine SHALL atomically lock all $N$ required beds in the agreed target room simultaneously. If insufficient beds remain, the transaction rolls back cleanly.
- **FR-07.5 (Audit Trail):** Every allocation SHALL produce an immutable `AllocationHistory` record noting the bed, room, timestamp, and authorizing user.

### 4.8 Module 8: LPU Economic Tier Matrix & Electricity Allowances
- **FR-08.1 (10-Month Fee Catalog):** Room pricing SHALL adhere to LPU standard tier pricing:
  - 1-Seater AC: ₹1,63,000 (Standard) / ₹2,00,000 (Studio Apartment)
  - 2-Seater Cooler: ₹1,23,000 / 2-Seater AC: ₹1,43,000
  - 3-Seater Cooler: ₹1,08,000 / 3-Seater AC: ₹1,23,000
  - 4-Seater Cooler: ₹93,000 / 4-Seater AC: ₹1,03,000
- **FR-08.2 (Early Decision Benefit):** Applications submitted before the EDB deadline SHALL automatically receive a flat ₹10,000 tuition/lodging deduction.
- **FR-08.3 (Electricity Allowance Division):** Each room tier carries an annual kWh allowance (e.g., 2S Cooler = 400 kWh, 2S AC = 750 kWh). If actual consumption exceeds the quota, overage fees SHALL be split equally across active occupants:
  $$\text{Overage Fee per Student} = \frac{(\text{Actual kWh} - \text{Quota kWh}) \times \text{Tariff}}{\text{Active Room Occupant Count}}$$

### 4.9 Module 9: Digital Gate Pass Finite State Machine
- **FR-09.1 (Pass Categorization):** Students SHALL request `DAY_PASS` (Local Outing), `OUTSTATION_PASS` (Home Visit), or `EMERGENCY_LEAVE`.
- **FR-09.2 (FSM State Transitions):** Gate passes SHALL transition through valid states only:
  $$\text{SUBMITTED} \longrightarrow \text{PENDING\_PARENT} \longrightarrow \text{PENDING\_WARDEN} \longrightarrow \text{APPROVED} \longrightarrow \text{ACTIVE\_OUTSIDE} \longrightarrow \text{CLOSED\_RETURNED}$$
- **FR-09.3 (QR Token Generation):** Upon Warden approval, the system SHALL generate a unique, cryptographically random UUID4 token represented as a scannable QR code.
- **FR-09.4 (Turnstile Scan & Overdue Alerts):** Security turnstile scans SHALL transition the pass to `ACTIVE_OUTSIDE` on departure and `CLOSED_RETURNED` on arrival. If the expected return time passes while active, the status SHALL update to `OVERDUE`.

### 4.10 Module 10: Relationship Management System (RMS) Maintenance Desk
- **FR-10.1 (Trade Classification):** Maintenance tickets SHALL be filed under valid trades: `PLUMBING`, `ELECTRICAL`, `WIFI_LAN`, `CARPENTRY`, `APPLIANCE`, `PEST_CONTROL`.
- **FR-10.2 (SLA Hour Mapping):** Deadlines SHALL be calculated from ticket creation:
  - `EMERGENCY`: **4 Hours**
  - `HIGH`: **12 Hours**
  - `MEDIUM`: **24 Hours**
  - `LOW`: **48 Hours**
- **FR-10.3 (Automated Escalation):** If an open ticket exceeds its SLA deadline (`now > sla_deadline`), the system SHALL flag the ticket as `ESCALATED` and notify the Chief Warden.
- **FR-10.4 (Warden Dispatch Queue):** Wardens SHALL update ticket statuses (`IN_PROGRESS`, `RESOLVED`, `CLOSED`) with resolution notes.

---

## 5. External Interface Requirements

### 5.1 User Interfaces
- **Design System:** Material 3 semantic structure combined with Watermelon UI tokens (JetBrains Mono tabular figures, Schibsted Grotesk body typography).
- **Responsive Layout:** The application SHALL render without horizontal scrollbars (`scrollWidth <= innerWidth`) on screens ranging from 360px mobile viewports to 2560px ultrawide displays.
- **Theme Support:** Clean CSS variables supporting instant runtime toggle between Light and Dark themes (`data-theme="light"` / `data-theme="dark"`).
- **Command Palette:** Keyboard-driven quick navigation modal (`Ctrl+K` / `Cmd+K`) supporting route transitions with automatic modal dismissal.

### 5.2 Software & API Interfaces
- **Headless JSON REST API:** All client-server communication SHALL occur via clean, predictable JSON endpoints under `/api/`:
  - `POST /api/auth/login/`: Identifier and password authentication.
  - `POST /api/auth/register/`: Registry verification and account creation.
  - `GET /api/auth/me/`: Current user session and profile payload.
  - `GET /api/hostels/` & `GET /api/hostels/<id>/`: Complex and floor plan data.
  - `GET /api/rooms/`: Catalog search with capacity and cooling filters.
  - `GET /api/roommates/discover/`: 7-factor ranked recommendations and ID search.
  - `POST /api/roommates/requests/send/`: Peer request dispatch.
  - `POST /api/roommates/requests/<id>/respond/`: Accept/Reject with room alignment check.
  - `POST /api/applications/`: Dual-choice accommodation submission.
  - `POST /api/gatepass/`: Gate pass creation and status tracking.
  - `POST /api/rms/tickets/`: Maintenance complaint submission and SLA tracking.

### 5.3 Gateway & Proxy Interface
- In production, Vercel edge proxies SHALL rewrite `/api/(.*)` and `/admin/(.*)` to the upstream Railway container domain to maintain first-party session cookie context.

---

## 6. Non-Functional Requirements (NFR)

### 6.1 Performance & Load
- **API Response Latency:** Under standard load, 95% of read queries SHALL return in under **150ms**; complex allocation transactions SHALL execute in under **300ms**.
- **Frontend Bundle Size:** Primary application JS bundle SHALL NOT exceed **100 kB** gzip (achieved via Rolldown code-splitting: `72.27 kB` entrypoint).
- **Query Optimization:** All ORM lookups SHALL use `select_related()` on foreign keys and `prefetch_related()` on reverse/many-to-many sets to maintain strictly zero $N+1$ query regressions.

### 6.2 Concurrency & Data Integrity
- **Zero Double-Bookings:** Even when 1,000 students submit allocation requests for the same room simultaneously, database row-level locking SHALL guarantee that each bed is allocated to exactly one student.
- **ACID Compliance:** All multi-step domain mutations (registration, group formation, bed allocation) SHALL execute inside `transaction.atomic()` blocks.

### 6.3 Security Defenses
- **OWASP Top 10 Mitigation:**
  - SQL Injection: 100% parameterization via Django ORM; raw SQL strictly forbidden.
  - Cross-Site Scripting (XSS): Automatic HTML escaping in React and Django templates.
  - CSRF: Mandatory CSRF tokens on mutating requests.
  - Authentication: PBKDF2 SHA-256 with 870,000 iterations for password storage.
- **Gender Segregation:** Hard foreign-key level policy enforcement preventing male students from booking female hostels and vice versa.

### 6.4 Maintainability & Testing
- **Automated Test Coverage:** Core domain services, API endpoints, and authentication backends SHALL maintain 100% pass rate across the automated `pytest` test suite (**143 passed tests with 0 warnings**).
- **Code Organization:** Business logic SHALL reside strictly inside domain service layers (`apps/<domain>/services/`) rather than being tangled within views or models.

---

## 7. Verification & Acceptance Criteria

| ID | Requirement Category | Acceptance Verification Method |
| :--- | :--- | :--- |
| **AC-01** | Identity Verification | Pre-seeded synthetic registry records (`QA990001`, `QA990002`, `QA990003`) verified via real browser automated registration tests. Invalid phone and duplicate claim attempts return HTTP 400. |
| **AC-02** | Roommate Matching | Deterministic algorithm unit tests verify exact weight summation ($1.00$), symmetry ($S(A, B) \equiv S(B, A)$), and dietary categorical scoring. Exact ID lookup (`?q=`) returns HTTP 200. |
| **AC-03** | Mutual Room Alignment | Multi-user browser testing confirms that accepting a roommate request where students selected different rooms triggers HTTP 400 with the exact alignment error message. |
| **AC-04** | Pessimistic Locking | Multi-threaded concurrency benchmark tests prove that simultaneous allocation requests on a single bed allow exactly one winner while gracefully falling back subsequent applicants to waitlist. |
| **AC-05** | Gate Pass & RMS | Real browser interaction confirms that students can file passes and maintenance tickets, which immediately render in the Warden Command Center queue with live counters. |
| **AC-06** | Mobile Responsiveness | DevTools viewport emulation at `360×800` confirms zero horizontal overflow (`scrollWidth <= 360`) and zero overlapping interactive elements on auth and dashboard screens. |
| **AC-07** | Automated Regression | All 143 unit and integration tests pass cleanly under Python 3.13; Vite build compiles with zero TypeScript errors. |

---

*End of Software Requirements Specification (SRS).*
