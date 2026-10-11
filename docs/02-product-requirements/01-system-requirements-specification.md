# Document ID: DOC-REQ-001
# System Requirements Specification (SRS): Functional Requirements

> **Document Version:** 1.0.0  
> **Classification:** Engineering Baseline Specification  
> **Status:** APPROVED  
> **Authoring Lead:** Senior Business Analyst & Principal Software Architect  
> **Review Date:** October 2026  
> **Target System:** AlumniConnect v2.0 Enterprise & Academic Release  

---

## 1. Specification Framework & Requirement Taxonomy

This document specifies all functional requirements for the AlumniConnect platform. Each requirement adheres to an industry-standard specification schema:
- **Requirement ID (`REQ-xxx-xxx`):** Immutable, stable identifier for end-to-end traceability.
- **Title & Primary Actors:** Who initiates and benefits from the capability.
- **Preconditions:** System or user states that must exist prior to execution.
- **Functional Description & Business Rules:** Concrete behavioral rules, deterministic logic, and constraints.
- **Inputs & Validation Rules:** Field requirements, regex, payload formats.
- **Outputs & Database State Changes:** Exact entity modifications.
- **Error Conditions & Edge Cases:** Deterministic failure handling and HTTP/Socket error codes.
- **Acceptance Criteria:** Testable, binary conditions required to consider the requirement met.

---

## 2. Foundation & Institutional Identity (`REQ-FND` & `REQ-COL`)

### REQ-COL-001: Canonical Institutional Hierarchy & Geographic Cascading
- **Primary Actors:** Anonymous Visitor, Enrolling User, System Administrator
- **Preconditions:** Location states and districts exist in the system database.
- **Business Rules:**
  1. Every academic institution must be assigned a unique, immutable UUID `collegeId`.
  2. Institutional identity must never be established solely by text matching on college name.
  3. The college selector must enforce a 3-tier geographic cascade: `State` -> `District` -> `College`.
  4. Colleges must be indexed by `stateId`, `districtId`, and normalized `name`.
- **Inputs:** `stateId` (UUID, required), `districtId` (UUID, optional/cascade).
- **Outputs:** Filtered JSON array of canonical colleges: `[{ id, name, state, district, emailDomain }]`.
- **Error Conditions:** If `stateId` is invalid, return HTTP `400 Bad Request`. If no colleges exist in district, return empty array `[]` (HTTP 200).
- **Acceptance Criteria:** Selecting a state dynamically filters available districts within <100ms; selecting a district limits college dropdown exclusively to institutions within that geographic district.

---

### REQ-COL-002: Moderated Institution Addition Request Workflow
- **Primary Actors:** Enrolling Student / Alumnus, System Administrator
- **Preconditions:** User is on the College Selection viewport; desired college does not exist in the dropdown.
- **Business Rules:**
  1. Users must not directly insert colleges into the active `colleges` table (remediates `DEF-01`).
  2. Submitting an unavailable college must generate an `InstitutionAdditionRequest` record with status `PENDING_REVIEW`.
  3. The submitter may complete account registration with their affiliation flagged as `PENDING_INSTITUTION_APPROVAL`.
  4. Adding a college does not verify the submitter’s academic or student status.
  5. Upon Administrator review and approval, the institution is promoted to the canonical `colleges` table, making it selectable by other users.
- **Inputs:** `collegeName` (string, 3–150 chars, required), `stateId` (UUID, required), `districtName` (string, required), `officialWebsite` (URL, optional), `emailDomain` (e.g. `@mit.edu`, optional).
- **Outputs:** HTTP `201 Created` with request ticket ID; admin notification generated.
- **Error Conditions:** Duplicate pending submission for identical normalized name and district returns HTTP `409 Conflict` pointing to the existing ticket.
- **Acceptance Criteria:** The newly requested college does NOT appear in the public college selector until an Administrator explicitly executes an approval action.

---

## 3. Discovery & Institutional Scoping (`REQ-DISC`)

### REQ-DISC-001: Strict Alma Mater Isolation in Default Discovery
- **Primary Actors:** Verified Student, Verified Alumnus
- **Preconditions:** User is authenticated and belongs to a confirmed `collegeId`.
- **Business Rules:**
  1. The default Directory and People Recommendations view must strictly filter recommendations to users where `user.collegeId === currentSession.collegeId` (remediates `DEF-05`).
  2. Under no circumstance may default recommendation queries silently merge or interleave alumni from other universities into the primary feed.
  3. If a college has zero registered alumni, the system must render a clear, branded empty state: *"Be the pioneer alumnus from [College Name]"* with invite links, rather than injecting external alumni.
- **Inputs:** Current authenticated user context, optional filters (`department`, `graduationYear`, `domain`, `skills`).
- **Outputs:** Paginated list of same-college users with connection status indicators.
- **Error Conditions:** Unauthenticated access returns HTTP `401 Unauthorized`.
- **Acceptance Criteria:** Automated integration test verifies that querying `/api/v1/users/same-college` never returns a user whose `collegeId` differs from the caller's `collegeId`.

---

### REQ-DISC-002: Explicit Multi-College Exploration
- **Primary Actors:** Verified Student, Verified Alumnus
- **Preconditions:** User explicitly navigates to the "Other Institutions" secondary tab.
- **Business Rules:**
  1. Exploring users outside one's alma mater requires deliberate user action via the "Other Colleges" tab.
  2. Cross-college browsing requires selecting a target `state` and target `collegeId` or searching by explicit skill across public profiles.
  3. Profiles with `profileVisibility: COLLEGE_ONLY` must be completely excluded from cross-college search results.
- **Inputs:** `targetCollegeId` (UUID, optional), `skillTag` (string, optional), `domain` (enum, optional), `page` (integer).
- **Outputs:** Paginated list of public profiles matching cross-college search criteria.
- **Acceptance Criteria:** Private same-college profiles do not leak into cross-college queries; search clearly badges each result with their home institution name.

---

## 4. Connections & Network State (`REQ-CONN`)

### REQ-CONN-001: Bilateral Connection Request Lifecycle
- **Primary Actors:** Authenticated Requester, Target Recipient
- **Preconditions:** Users are distinct (`requesterId !== receiverId`); no active block exists between users.
- **Business Rules:**
  1. A connection request starts in `PENDING` status.
  2. A user cannot send a duplicate connection request if one is already `PENDING` or `ACCEPTED`.
  3. The requester may cancel/withdraw a `PENDING` request, transitioning it to `WITHDRAWN` or removing the record.
  4. The recipient may `ACCEPT` or `REJECT` the request.
  5. Mutual connection status (`CONNECTED`) is achieved strictly upon explicit recipient acceptance.
  6. Rejection transitions the record to `REJECTED`. Re-requesting after rejection is throttled by a 30-day cooldown window.
- **Inputs:** `POST /api/v1/connections/request` with `{ targetUserId }`. `POST /api/v1/connections/respond` with `{ requestId, action: 'ACCEPT' | 'REJECT' }`.
- **Outputs:** Updated `ConnectionRequest` record; notification dispatched to requester upon acceptance.
- **Database Changes:** `connection_requests` table records state transition; `updated_at` updated.
- **Error Conditions:** Sending request to self returns `400 Bad Request`. Sending to blocked user returns `403 Forbidden`. Duplicate request returns `409 Conflict`.
- **Acceptance Criteria:** Recipient cannot be connected automatically without active click/touch on "Accept"; permissions upgrade immediately upon transaction commit.

---

## 5. Time-Bounded Messaging & WebRTC Calling (`REQ-CHAT` & `REQ-CALL`)

### REQ-CHAT-001: Server-Enforced 2-Minute Introductory Chat Window
- **Primary Actors:** Unconnected Student and Alumnus
- **Preconditions:** Both users are authenticated; `ConnectionRequest` status is NOT `ACCEPTED`.
- **Business Rules:**
  1. Unconnected users may initiate a 1-on-1 direct message conversation to introduce themselves.
  2. The server records the timestamp of the very first message in the chat (`firstMessage.createdAt`).
  3. The server computes: `remainingMs = 120000 - (Date.now() - firstMessage.createdAt)`.
  4. While `remainingMs > 0`, messages are accepted and delivered.
  5. When `remainingMs <= 0`, the server strictly rejects incoming messages with HTTP `403 Forbidden` (`{ locked: true, trialRemainingSeconds: 0 }`).
  6. To unlock unlimited messaging, either user must send a connection request and the other must accept it.
- **Inputs:** `POST /api/v1/messages` with `{ toUserId, content }`.
- **Outputs:** Created `Message` record or HTTP 403 lock error.
- **Acceptance Criteria:** Automated integration test attempts to post message at t = 121 seconds from first message timestamp; server rejects write with HTTP 403 and message is not written to database.

---

### REQ-CHAT-002: Real-Time Socket.IO Messaging & State Synchronization
- **Primary Actors:** Connected Chat Participants
- **Preconditions:** Client establishes WebSocket connection with valid JWT in handshake auth.
- **Business Rules:**
  1. Sockets join private rooms: `user:${userId}` and `chat:${chatId}`.
  2. Sending a message emits `message:new` to room `chat:${chatId}` and dispatches in-app notification to `user:${toUserId}`.
  3. Supports ephemeral events: `typing` and `stopTyping` with client-side 1500ms auto-debounce.
  4. Message payload is encrypted at rest using server-side AES-256-GCM prior to database commit.
- **Inputs:** Socket event `joinChat` (`{ chatId }`), `typing` (`{ chatId }`), `stopTyping` (`{ chatId }`).
- **Outputs:** Real-time event broadcasts to peer socket.
- **Error Conditions:** Socket lacking valid JWT disconnected immediately during handshake (`Unauthorized`).
- **Acceptance Criteria:** Message delivered to active peer within <50ms; typing indicator disappears within 2000ms of user stopping typing.

---

### REQ-CALL-001: WebRTC 1-on-1 Audio/Video Call Sessions
- **Primary Actors:** Connected Users (or Same-College Peers with Call Permissions)
- **Preconditions:** Both users are online; caller has active camera/microphone browser permission.
- **Business Rules:**
  1. Caller invokes `POST /api/v1/calls` with `{ toUserId, mode: 'VOICE' | 'VIDEO' }`.
  2. Server generates `CallSession` in `RINGING` state and emits `call:incoming` to recipient's socket room.
  3. Recipient has 30 seconds to accept or reject. If timeout expires, status transitions to `MISSED`.
  4. Upon `call:accept`, status transitions to `ACTIVE`, and Socket.IO relays WebRTC signaling packets (`call:signal` containing SDP offers/answers and ICE candidates).
  5. Ending or disconnecting sets status to `ENDED` and records `durationSeconds`.
- **Inputs:** Signaling payloads relayed via Socket.IO; media streams flow peer-to-peer (or via TURN relay).
- **Error Conditions:** Calling a user currently engaged in an active call returns HTTP `486 Busy Here`.
- **Acceptance Criteria:** Audio/video connects P2P; media stream terminates immediately upon either user clicking "End Call".

---

## 6. Student-to-Alumni Lifecycle & Verification (`REQ-LIFE`)

### REQ-LIFE-001: Monitored Graduation Review & Document Verification Workflow
- **Primary Actors:** Enrolled Student, Graduating Candidate, Institutional Reviewer
- **Preconditions:** User account exists with `role: 'STUDENT'`, `graduationYear`, and `graduationMonth`.
- **Business Rules:**
  1. The system must NEVER automatically mutate a user's role to `ALUMNI` solely based on date elapsed (remediates `DEF-02`).
  2. When chronological graduation date passes (`graduationDate <= now`), the user's `AcademicStatus` transitions to `GRADUATION_PENDING_VERIFICATION`.
  3. An automated notification and email prompt the user: *"Congratulations on completing your degree! Please upload your degree certificate or provisional marksheet to unlock Verified Alumni status."*
  4. User uploads verification proof via `POST /api/v1/verification/graduation-proof`.
  5. The institution reviewer or admin inspects proof and executes approval.
  6. Upon approval, `AcademicStatus` becomes `ALUMNI_VERIFIED` and `PlatformRole` upgrades to `ALUMNUS`.
- **Inputs:** PDF/Image proof file, degree certificate number, final GPA/division (optional).
- **Outputs:** `VerificationLog` entry; user role updated; verification badge displayed.
- **Error Conditions:** Rejected submission sends feedback with reason; status remains `STUDENT` pending re-upload.
- **Acceptance Criteria:** Database query confirms user role remains `STUDENT` until an explicit verification review approval transaction is committed.

---

## 7. Mentorship Marketplace & Senior Mapping (`REQ-MENT`)

### REQ-MENT-001: Mentor Availability & Booking Caps
- **Primary Actors:** Verified Alumnus (Mentor), Student (Mentee)
- **Preconditions:** Mentor has profile flag `openToMentorship: true`.
- **Business Rules:**
  1. Mentor defines `maxMentees` (default 3, range 1–10) and mentorship domain topics.
  2. A student submits a formal booking request with a structured `requestMessage` and proposed goals.
  3. If mentor's active mentorship count equals `maxMentees`, booking form is disabled with message: *"Mentor has reached capacity."*
  4. Mentor has 7 days to `ACCEPT` or `DECLINE`. Unanswered requests transition to `EXPIRED`.
- **Inputs:** `POST /api/v1/mentorship/request` with `{ mentorId, requestMessage, goals: string[] }`.
- **Outputs:** `Mentorship` record in `PENDING` state; notification dispatched to mentor.
- **Acceptance Criteria:** Mentorship request blocked when mentor reaches active capacity limit.

---

### REQ-MENT-002: Structured Mentorship Sessions & Goal Tracking
- **Primary Actors:** Mentor, Mentee
- **Preconditions:** Mentorship status is `ACTIVE`.
- **Business Rules:**
  1. Mentorship workspace displays shared checklist of `MentorshipGoals`.
  2. Either party may add shared session notes (`MentorshipNote`).
  3. Upon conclusion of mentorship (or after 30 days), either user may mark session `COMPLETED`.
  4. Completing a session prompts both participants to complete an anonymous satisfaction review (`MentorshipSurvey`).
- **Inputs:** Goal toggle, note content, completion survey rating (1–5 stars) and feedback.
- **Outputs:** Updated goal state; survey stored for mentor reputation index.
- **Acceptance Criteria:** Notes and goal updates update in real-time across both user sessions.

---

## 8. Opportunities & Referral Pipeline (`REQ-OPP`)

### REQ-OPP-001: Job, Internship & Event Radar
- **Primary Actors:** Verified Alumnus (Poster), Student (Applicant)
- **Preconditions:** Poster is verified alumnus or college admin.
- **Business Rules:**
  1. Poster creates Opportunity with `type` (`JOB`, `INTERNSHIP`, `EVENT`), `title`, `companyName`, `description`, `skillsRequired: string[]`, `deadline`, and optional `applicationUrl`.
  2. Opportunity is scoped to `collegeId` by default, with optional flag to broadcast cross-college.
  3. Opportunity Radar computes candidate compatibility score based on Jaccard similarity between candidate profile `skillTags` and opportunity `skillsRequired`.
- **Inputs:** `POST /api/v1/opportunities` with opportunity payload.
- **Outputs:** Created `Opportunity` record; indexed in search.
- **Acceptance Criteria:** Opportunities sorted by skill compatibility score for authenticated viewing user.

---

### REQ-OPP-002: Alumni Referral Request Workflow
- **Primary Actors:** Student, Job-Posting Alumnus
- **Preconditions:** Opportunity has flag `acceptingReferrals: true`.
- **Business Rules:**
  1. Student applies for internal referral by submitting `coverNote` and selecting their verified uploaded resume PDF.
  2. System creates `OpportunityApplication` with status `APPLIED`.
  3. Alumnus reviews application in their candidate dashboard and updates status: `SHORTLISTED`, `REFERRED`, `REJECTED`.
  4. Applicant receives real-time notification at each state transition.
- **Inputs:** `POST /api/v1/opportunities/:opportunityId/apply` with `{ coverNote, resumeFileId }`.
- **Outputs:** Application record created; resume pre-signed access URL provided to poster.
- **Acceptance Criteria:** Non-connected students can submit referral requests; poster can inspect applicant resume via authenticated preview.

---

## 9. Academic Social Feed & Media Handling (`REQ-POST`)

### REQ-POST-001: Feed Publication & Multipart PDF Certificate Previews
- **Primary Actors:** Authenticated Student / Alumnus
- **Preconditions:** User account is active and in good standing.
- **Business Rules:**
  1. Posts support `type` (`GENERAL`, `CERTIFICATE`, `HACKATHON`, `EVENT`).
  2. Posts may attach images (JPEG/PNG/WebP, max 5MB) and PDF documents (max 15MB).
  3. PDF documents (certificates, papers) must render inline on the feed using a secure PDF viewer canvas, allowing zoom and multi-page paging.
  4. Users may like (toggle), comment, and share posts. Post counter aggregates (`likeCount`, `commentCount`, `shareCount`) are updated atomically.
- **Inputs:** `POST /api/v1/posts` with `{ title, description, type, fileIds: string[] }`.
- **Outputs:** Created `Post` entity returned; feed updated.
- **Acceptance Criteria:** PDF certificates display embedded page preview on feed card without requiring file download to user device.

---

## 10. Alumni Engagement Leaderboard (`REQ-LEAD`)

### REQ-LEAD-001: Fair Engagement Scoring & Privacy Opt-Out
- **Primary Actors:** Verified Alumni, Student Viewers
- **Preconditions:** Leaderboard query executed within college scope.
- **Business Rules:**
  1. Alumni are ranked on an objective engagement score formula:
     $$\text{Score} = (\text{ProfileCompletion} \times 20) + (\text{MentorshipsCompleted} \times 50) + (\text{ReferralsActioned} \times 40) + (\text{AcceptedAnswers} \times 15)$$
  2. Leaderboard is strictly scoped to the viewing user's institution to foster healthy local community pride.
  3. Alumni must have an explicit profile privacy toggle: `showOnLeaderboard: boolean` (default: `true`). If toggled false, they are excluded from public rankings.
  4. Commercial recruiter spamming or rapid bot posting is filtered out by anti-gaming heuristics.
- **Outputs:** Top 50 ranked alumni for current college with badges (e.g. *"Top Mentor"*, *"Career Champion"*).
- **Acceptance Criteria:** Toggling `showOnLeaderboard: false` immediately removes alumnus from leaderboard rankings within <500ms.

---

## 11. Safety, Moderation & Privacy (`REQ-MOD`)

### REQ-MOD-001: Abuse Reporting, Automated Throttling & Admin Triage
- **Primary Actors:** Reporting User, Target User, Platform Moderator
- **Preconditions:** Both accounts exist; filer is authenticated.
- **Business Rules:**
  1. Users may report any profile, message, post, or opportunity for violations (`HARASSMENT`, `SPAM`, `IMPERSONATION`, `INAPPROPRIATE_CONTENT`).
  2. Filing a report generates an immutable `Report` record with `status: OPEN`.
  3. If an account accumulates **5 unique reports within a rolling 14-day window**, the server automatically engages **Restricted Mode** (user cannot initiate new chats, start calls, or post publicly).
  4. Platform administrators inspect reports via the moderation dashboard and execute: `DISMISS`, `ISSUE_WARNING`, or `PERMANENT_BAN`.
  5. Banned users have their sessions revoked immediately (`tokenVersion` incremented; all refresh tokens revoked).
- **Inputs:** `POST /api/v1/reports` with `{ targetId, reason, evidenceNotes }`.
- **Outputs:** Created `Report` record; automated throttle check triggered.
- **Acceptance Criteria:** User reaching 5 reports is blocked from starting calls or initiating new chats within <1 second of threshold trigger.
