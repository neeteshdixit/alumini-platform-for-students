# Document ID: DOC-TST-002
# Master Test Case Catalog & Acceptance Gate Criteria

> **Document Version:** 1.0.0  
> **Classification:** QA Engineering & Verification Baseline  
> **Status:** APPROVED  
> **Authoring Lead:** QA & Test Automation Architect  
> **Review Date:** October 2026  
> **Coverage:** Traceable mapping to all requirements in `DOC-REQ-001`  

---

## 1. Test Case Catalog Schema

Every test case in this catalog is designed for automated execution within Vitest, Supertest, or Playwright:
- **Test ID (`TEST-xxx-xxx`):** Unique, immutable identifier.
- **Related REQ / JRN:** Cross-reference to functional requirement and user journey.
- **Test Type:** `Unit`, `Integration`, `E2E`, or `Security`.
- **Preconditions & Setup:** Fixtures and seeded state required.
- **Execution Steps:** Sequential actions and payloads.
- **Expected Outcome:** Deterministic assertions on HTTP status, database state, or UI elements.

---

## 2. Master Test Case Catalog

| Test ID | Module & REQ | Test Objective | Test Type | Preconditions | Execution Steps & Assertions | Expected Outcome |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| **TEST-AUTH-001** | `REQ-AUTH-001`<br>`JRN-AUTH-001` | Validate new user registration with valid payload. | Integration | Database seeded with test College. | `POST /api/v1/auth/signup` with valid email, password, and `collegeId`. | HTTP `201 Created`; User inserted with `verified = false`; OTP hashed in `email_otps`. |
| **TEST-AUTH-002** | `REQ-AUTH-001` | Reject duplicate email registration. | Integration | User with `test@college.edu` exists. | `POST /api/v1/auth/signup` with identical email. | HTTP `409 Conflict` with message *"Email already registered"*. |
| **TEST-AUTH-003** | `REQ-AUTH-002`<br>`JRN-AUTH-001` | Verify registration using valid 6-digit OTP. | Integration | Unverified user exists with OTP record. | `POST /api/v1/auth/verify-otp` with valid OTP code. | HTTP `200 OK`; `user.verified` becomes `true`; JWT access token returned; refresh token cookie set. |
| **TEST-AUTH-004** | `REQ-AUTH-002` | Invalidate OTP after 5 consecutive failed attempts. | Security | Unverified user with OTP record. | Submit 5 incorrect OTP codes consecutively. | On 5th attempt, OTP record marked invalid; subsequent attempts return HTTP `400 Bad Request`. |
| **TEST-AUTH-005** | `REQ-AUTH-006` | Refresh token rotation and token family reuse detection. | Security | Active user session with refresh token cookie. | 1. Invoke `POST /refresh-token` -> Succeeds with new tokens.<br>2. Replay original (old) refresh token. | Second call triggers security alert; revokes ALL refresh tokens for user; increments `tokenVersion`. |
| **TEST-COL-001** | `REQ-COL-001` | Geographic cascading of districts by state. | Integration | Location states and districts seeded. | `GET /api/v1/locations/districts?stateId=:id`. | HTTP `200 OK`; array contains exclusively districts belonging to that state. |
| **TEST-COL-002** | `REQ-COL-002`<br>`JRN-COL-001` | User submissions create pending request, not active college. | Security | Authenticated student. | `POST /api/v1/colleges/requests` with new college name. | HTTP `201 Created`; `institution_addition_requests` record created with `PENDING_REVIEW`; 0 records in `colleges`. |
| **TEST-COL-003** | `REQ-COL-002` | Admin approval promotes college to canonical database. | Integration | Pending college addition ticket exists. | `POST /api/v1/admin/colleges/requests/:id/approve` by Admin. | HTTP `200 OK`; new `College` inserted; ticket marked `APPROVED`; linked users updated. |
| **TEST-DISC-001** | `REQ-DISC-001`<br>`JRN-DISC-001` | Default discovery returns strictly same-college users. | Integration | Users seeded across College A and College B. | Authenticated user from College A queries `GET /api/v1/users/same-college`. | HTTP `200 OK`; 100% of returned users have `collegeId === College A`; 0 users from College B. |
| **TEST-DISC-002** | `REQ-DISC-002` | Cross-college search excludes private profiles. | Integration | User in College B has `profileVisibility: COLLEGE_ONLY`. | User in College A searches `GET /api/v1/users/other`. | User with `COLLEGE_ONLY` is completely omitted from returned results. |
| **TEST-CONN-001** | `REQ-CONN-001`<br>`JRN-CONN-001` | Prevent self-connection requests. | Unit/Int | Authenticated user. | `POST /api/v1/connections/request` with `targetUserId = callerId`. | HTTP `400 Bad Request` with message *"Cannot connect to yourself"*. |
| **TEST-CONN-002** | `REQ-CONN-001` | Accept connection request transitions status to ACCEPTED. | Integration | Pending connection request exists. | Recipient invokes `POST /api/v1/connections/respond` with `action: 'ACCEPT'`. | HTTP `200 OK`; `status` updates to `ACCEPTED`; notification dispatched to sender. |
| **TEST-CONN-003** | `REQ-CONN-001` | Rejection initiates 30-day cooldown. | Integration | Recipient rejects connection request. | Sender attempts to re-request immediately. | HTTP `403 Forbidden` with cooldown message; request write rejected. |
| **TEST-CHAT-001** | `REQ-CHAT-001`<br>`JRN-CHAT-001` | Allow introductory messaging within 120 seconds. | Integration | Unconnected users; chat exists with first message at $t = 30\text{s}$ ago. | `POST /api/v1/messages` with content. | HTTP `201 Created`; message encrypted and stored; trial time remaining returned. |
| **TEST-CHAT-002** | `REQ-CHAT-001`<br>`JRN-CHAT-001` | Reject messaging after 120-second trial expires. | Integration | Unconnected users; first message was sent $125\text{s}$ ago. | `POST /api/v1/messages` with content. | HTTP `403 Forbidden` with `{ locked: true, trialRemainingSeconds: 0 }`; 0 records written to DB. |
| **TEST-CHAT-003** | `REQ-CHAT-002` | Message ciphertext is encrypted at rest via AES-256-GCM. | Security | Valid message sent via API. | Direct SQL query: `SELECT content FROM messages WHERE id = :id`. | Raw database content contains encoded IV, auth tag, and ciphertext; zero plaintext. |
| **TEST-CALL-001** | `REQ-CALL-001`<br>`JRN-CALL-001` | Start WebRTC call creates RINGING session and emits socket ring. | Integration | Connected users online on Socket.IO. | `POST /api/v1/calls` with `{ toUserId, mode: 'VIDEO' }`. | HTTP `201 Created`; `call:incoming` emitted to callee socket room; session status `RINGING`. |
| **TEST-CALL-002** | `REQ-CALL-001` | Ending call sets status to ENDED and calculates duration. | Integration | Active call session in progress for 120 seconds. | Caller invokes `POST /api/v1/calls/:id/end`. | HTTP `200 OK`; `CallSession.status = 'ENDED'`; `durationSeconds = 120`; socket `call:ended` emitted. |
| **TEST-MENT-001** | `REQ-MENT-001`<br>`JRN-MENT-001` | Reject mentorship booking when mentor reaches capacity. | Integration | Mentor has `maxMentees = 3` and 3 active mentorships. | Student invokes `POST /api/v1/mentorship/request`. | HTTP `403 Forbidden` with message *"Mentor has reached capacity"*. |
| **TEST-MENT-002** | `REQ-MENT-002` | Completing mentorship unlocks rating survey and releases slot. | Integration | Active mentorship in progress. | Participant marks completed and submits 5-star survey. | `Mentorship.status = 'COMPLETED'`; mentor active count decrements to 2; 50 points added to leaderboard. |
| **TEST-OPP-001** | `REQ-OPP-001`<br>`JRN-OPP-001` | Restrict opportunity creation strictly to Alumni and Admins. | Security | Authenticated Student (`role: STUDENT`). | `POST /api/v1/opportunities` with job payload. | HTTP `403 Forbidden: Only alumni can post opportunities`. |
| **TEST-OPP-002** | `REQ-OPP-002` | Prevent duplicate referral applications. | Integration | Student already applied to Opportunity A. | Student attempts second application to Opportunity A. | HTTP `409 Conflict: Already applied to this opportunity`. |
| **TEST-FEED-001** | `REQ-POST-001`<br>`JRN-POST-001` | Reject uploaded PDF files exceeding 15MB limit. | Integration | Authenticated user uploads 18MB PDF. | `POST /api/v1/upload/pdf` with 18MB payload. | HTTP `400 Bad Request: PDF size must be 15MB or less`. |
| **TEST-FEED-002** | `REQ-POST-001` | Inline PDF Document Viewer renders without errors. | E2E | Feed post with valid PDF attachment. | Playwright loads `/dashboard` and checks PDF canvas element. | PDF canvas renders with valid page text; zoom controls responsive. |
| **TEST-LIFE-001** | `REQ-LIFE-001`<br>`JRN-LIFE-001` | Cron job never auto-promotes student to alumnus on date expiry. | Integration | Student has `graduationDate < now()`. | Execute `syncGraduationStatuses()`. | Student `academicStatus` becomes `GRADUATION_PENDING_VERIFICATION`; `role` remains `STUDENT`! |
| **TEST-LIFE-002** | `REQ-LIFE-001` | Admin verification approval upgrades role to ALUMNI with audit log. | Integration | Student uploaded degree certificate. | Reviewer approves via `/admin/verify/:id`. | User `role` updates to `ALUMNI`; `VerificationLog` entry created with reviewer ID. |
| **TEST-MOD-001** | `REQ-MOD-001`<br>`JRN-MOD-001` | Accumulating 5 reports triggers automated restricted mode. | Security | User receives 5 unique reports from 5 different accounts. | 5th report submitted via `POST /api/v1/reports`. | User `accountStanding` transitions to `RESTRICTED`; calls and new chats blocked. |
| **TEST-MOD-002** | `REQ-MOD-001` | Banning user revokes active JWTs and all refresh tokens. | Security | Admin executes `PATCH /admin/users/:id/ban`. | Attacker attempts to call API with existing valid JWT. | `requireAuth` detects `tokenVersion` mismatch; rejects request with HTTP 401/403. |
