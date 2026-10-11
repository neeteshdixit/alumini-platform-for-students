# Document ID: DOC-IA-002
# Navigation Flow Graphs & System State Machines

> **Document Version:** 1.0.0  
> **Classification:** Systems Engineering & Interaction Architecture  
> **Status:** APPROVED  
> **Authoring Lead:** UX Architect & Principal Software Architect  
> **Review Date:** October 2026  
> **Target System:** AlumniConnect Platform Specification  

---

## 1. Master Client Navigation Graph

The flowchart below visualizes all user paths, authentication gates, protected routes, and failure/redirect states across the single-page application.

```mermaid
flowchart TD
    Start(["User Lands on App"]) --> CheckAuth{"Is Session Active?<br/>(AccessToken in Memory?)"}

    CheckAuth -->|No| Landing["/ (Landing Page)"]
    CheckAuth -->|Yes| Dash["/dashboard (Main Feed)"]

    Landing --> ClickLogin["Clicks Sign In"] --> LoginView["/login (AuthGate)"]
    Landing --> ClickSignup["Clicks Get Started"] --> SignupView["/signup (AuthGate)"]
    Landing --> ClickForgot["Clicks Forgot Password"] --> ForgotView["/forgot-password"]

    SignupView --> SubmitSignup["Submits Form"] --> OTPModal["Verify Email OTP Modal"]
    OTPModal -->|Success| Dash
    OTPModal -->|Resend| OTPModal

    LoginView --> SubmitLogin["Submits Credentials / Google"] --> CheckStanding{"Account Standing?"}
    CheckStanding -->|Active| Dash
    CheckStanding -->|Restricted| RestrictNotice["Restricted Access Mode"] --> Dash
    CheckStanding -->|Banned| BannedView["/banned (Account Suspended)"]

    ForgotView --> TokenEmail["Email Sent"] --> ResetView["/reset-password?token=..."] --> LoginView

    subgraph Authenticated AppShell
        Dash <--> Dir["/directory (Alma Mater Discovery)"]
        Dash <--> Opps["/opportunities (Jobs & Referrals)"]
        Dash <--> Msg["/messages (Chat & Calls)"]
        Dash <--> Ment["/mentorship (Mentorship Hub)"]
        Dash <--> Prof["/profile (Profile Settings)"]
        Dir <--> ProfOther["/profile/:userId"]
        Opps <--> OppDetail["/opportunities/:id/apply"]
    end

    subgraph Governance Views
        Prof --> CheckAdminRole{"Role == Admin?"}
        CheckAdminRole -->|Yes| AdminCol["/admin/college (Placement Admin)"]
        CheckAdminRole -->|Yes| AdminMod["/admin/moderation (Trust & Safety)"]
        CheckAdminRole -->|No| Unauth["403 Unauthorized Warning"]
    end

    subgraph Session Lifecycle Events
        TokenExpiry["Access Token Expires (15m)"] --> AutoRefresh{"Silent Refresh Success?<br/>(POST /refresh-token)"}
        AutoRefresh -->|Success| ActiveSess["Continue Seamlessly"]
        AutoRefresh -->|Failure / Revoked| ClearSess["Clear State & Cookie"] --> LoginView
        ClickLogout["Clicks Logout"] --> ClearSess
    end
```

---

## 2. Formal System State Machines

### 2.1 State Machine 1: Account Standing & Verification Lifecycle
Governs user onboarding, email verification, degree verification, and administrative discipline.

```mermaid
stateDiagram-v2
    [*] --> UNVERIFIED : User Submits Registration Form
    UNVERIFIED --> EMAIL_VERIFIED : Correct 6-Digit OTP Submitted
    UNVERIFIED --> [*] : Registration Abandoned / Expired (24h)

    EMAIL_VERIFIED --> STUDENT_ENROLLED : Enrolled with Valid College ID
    EMAIL_VERIFIED --> PENDING_INSTITUTION_APPROVAL : Submits New College Request

    PENDING_INSTITUTION_APPROVAL --> STUDENT_ENROLLED : Admin Approves College Request
    PENDING_INSTITUTION_APPROVAL --> REJECTED_INSTITUTION : Admin Rejects College

    STUDENT_ENROLLED --> GRADUATION_PENDING_VERIFICATION : Expected Graduation Date Elapses
    GRADUATION_PENDING_VERIFICATION --> ALUMNI_VERIFIED : Proof Approved by Reviewer
    GRADUATION_PENDING_VERIFICATION --> STUDENT_ENROLLED : User Appeals (Degree Extended)

    STUDENT_ENROLLED --> RESTRICTED : 5 Unique User Reports Received
    ALUMNI_VERIFIED --> RESTRICTED : 5 Unique User Reports Received
    RESTRICTED --> ACTIVE : Moderator Clears Reports
    RESTRICTED --> BANNED : Moderator Confirms Violation
    BANNED --> [*] : Permanent Account Suspension
```

- **Guards & Invariants:**
  - `STUDENT_ENROLLED` cannot transition to `ALUMNI_VERIFIED` without an explicit document approval transaction in `verification_logs`.
  - `BANNED` state forcibly increments `tokenVersion`, invalidating all active JWTs.

---

### 2.2 State Machine 2: Bilateral Connection Request Lifecycle
Governs networking requests between two distinct users.

```mermaid
stateDiagram-v2
    [*] --> NONE : Initial Unconnected State

    NONE --> PENDING : Requester Clicks "Connect"
    PENDING --> WITHDRAWN : Requester Clicks "Withdraw"
    PENDING --> ACCEPTED : Recipient Clicks "Accept"
    PENDING --> REJECTED : Recipient Clicks "Reject"

    WITHDRAWN --> NONE : Reset to Neutral State
    REJECTED --> COOLDOWN_BLOCKED : 30-Day Re-Request Cooldown Active
    COOLDOWN_BLOCKED --> NONE : 30 Days Expire

    ACCEPTED --> DISCONNECTED : Either User Unfriends
    DISCONNECTED --> NONE : Reset

    NONE --> BLOCKED : Either User Blocks
    PENDING --> BLOCKED : Either User Blocks
    ACCEPTED --> BLOCKED : Either User Blocks
    BLOCKED --> NONE : User Unblocks
```

- **Guards & Invariants:**
  - Users cannot send connection requests to themselves (`requesterId !== receiverId`).
  - Active `BLOCKED` status prevents sending any connection requests or viewing the target profile.

---

### 2.3 State Machine 3: 2-Minute Introductory Chat Window
Enforces the anti-spam introductory chat window between unconnected users.

```mermaid
stateDiagram-v2
    [*] --> TRIAL_NOT_STARTED : Chat Initialized between Unconnected Users
    TRIAL_NOT_STARTED --> TRIAL_ACTIVE : First Message Sent (t = 0s)
    note right of TRIAL_ACTIVE : Server records firstMessage.createdAt<br/>Countdown: 120s remaining

    TRIAL_ACTIVE --> TRIAL_ACTIVE : Subsequent Messages (t < 120s)
    TRIAL_ACTIVE --> TRIAL_EXPIRED_LOCKED : Time Elapses (t >= 120s)
    note right of TRIAL_EXPIRED_LOCKED : Server strictly throws HTTP 403<br/>UI locks textarea & send button

    TRIAL_ACTIVE --> UNLIMITED_CONNECTED : Connection Request Accepted
    TRIAL_EXPIRED_LOCKED --> UNLIMITED_CONNECTED : Connection Request Accepted
    note right of UNLIMITED_CONNECTED : Unlimited messaging & WebRTC calls unlocked
```

- **Guards & Invariants:**
  - Timer calculation is 100% server-authoritative (`Date.now() - firstMessage.createdAt`). Tampering with client clock has zero effect.
  - Connection acceptance immediately transitions chat to `UNLIMITED_CONNECTED`.

---

### 2.4 State Machine 4: WebRTC 1-on-1 Call Session Lifecycle
Governs real-time audio and video call signaling via Socket.IO.

```mermaid
stateDiagram-v2
    [*] --> IDLE : No Active Call
    IDLE --> RINGING : Caller Emits call:start
    note right of RINGING : 30-Second Ringing Timeout Window

    RINGING --> MISSED : 30s Timeout Reached (No Answer)
    RINGING --> REJECTED : Callee Clicks "Reject"
    RINGING --> CANCELLED : Caller Clicks "Cancel"
    RINGING --> ACTIVE : Callee Clicks "Accept"

    ACTIVE --> ACTIVE : WebRTC P2P Media Streaming
    ACTIVE --> ENDED : Either User Clicks "End Call"
    ACTIVE --> DISCONNECTED : Peer Network Failure (ICE Timeout)

    MISSED --> IDLE : Reset
    REJECTED --> IDLE : Reset
    CANCELLED --> IDLE : Reset
    ENDED --> IDLE : Record Duration in DB & Reset
    DISCONNECTED --> IDLE : Record Partial Duration & Reset
```

- **Guards & Invariants:**
  - A user cannot initiate or receive a call if they are already in state `RINGING` or `ACTIVE` (returns HTTP `486 Busy Here`).
  - Teardown guarantees that local hardware media streams (`MediaStreamTrack`) are explicitly stopped.

---

### 2.5 State Machine 5: Mentorship Booking & Completion Lifecycle
Governs structured mentorship requests, active sessions, and review surveys.

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Mentee Opens Booking Modal
    DRAFT --> PENDING_REVIEW : Mentee Submits Goals & Message
    note right of PENDING_REVIEW : Mentor has 7 days to review

    PENDING_REVIEW --> EXPIRED : 7 Days Elapse with No Action
    PENDING_REVIEW --> DECLINED : Mentor Clicks "Decline"
    PENDING_REVIEW --> ACTIVE : Mentor Clicks "Accept" (Mentee Cap < 3)

    ACTIVE --> ACTIVE : Shared Goals Updated & Notes Added
    ACTIVE --> CANCELLED : Either User Cancels with Reason
    ACTIVE --> COMPLETED : Either User Marks "Completed"

    COMPLETED --> SURVEY_PENDING : Trigger Post-Session Survey Modal
    SURVEY_PENDING --> ARCHIVED : Ratings Submitted (Score added to Leaderboard)
    EXPIRED --> [*]
    DECLINED --> [*]
    CANCELLED --> [*]
    ARCHIVED --> [*]
```

- **Guards & Invariants:**
  - Transition to `ACTIVE` is guarded by: `mentor.activeMenteesCount < mentor.maxMentees`.
  - Marking `COMPLETED` unlocks survey modals for both participants.

---

### 2.6 State Machine 6: Opportunity & Referral Pipeline Lifecycle
Governs jobs, internships, candidate applications, and internal alumni referrals.

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Alumnus Creates Opportunity
    DRAFT --> ACTIVE : Published with Deadline & Skills

    ACTIVE --> CLOSED : Deadline Reached or Poster Closes Opportunity
    ACTIVE --> APPLIED : Candidate Submits Application / Referral Request

    APPLIED --> SHORTLISTED : Alumnus Reviews Resume & Shortlists
    APPLIED --> REJECTED : Alumnus Declines Application
    SHORTLISTED --> REFERRED : Alumnus Submits Internal Referral
    SHORTLISTED --> REJECTED : Internal Application Fails

    REFERRED --> HIRED : Candidate Confirms Offer
    REFERRED --> CLOSED : Process Concludes
    CLOSED --> [*]
```

- **Guards & Invariants:**
  - Candidates cannot submit multiple applications to the exact same opportunity (`unique(opportunityId, applicantId)`).
  - Referral requests require an attached PDF resume.

---

### 2.7 State Machine 7: Institution Addition Request Lifecycle
Governs user-submitted colleges pending platform administrative verification.

```mermaid
stateDiagram-v2
    [*] --> SUBMITTED : User Submits Missing College Form
    SUBMITTED --> PENDING_REVIEW : Ticket Enters Admin Moderation Queue

    PENDING_REVIEW --> APPROVED : Admin Validates University Accreditation
    note right of APPROVED : College created in canonical table;<br/>Submitter notified & affiliation updated

    PENDING_REVIEW --> REJECTED : Admin Flags as Duplicate or Spoofed
    note right of REJECTED : Submitter notified; must re-select valid college

    APPROVED --> [*]
    REJECTED --> [*]
```

- **Guards & Invariants:**
  - Submissions matching an existing canonical college's normalized name are rejected automatically.
  - Approved colleges become instantly available in geographic dropdown cascades across all user sessions.
