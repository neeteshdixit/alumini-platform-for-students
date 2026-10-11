# Document ID: DOC-API-001
# REST API Catalog & Endpoint Contract Specifications

> **Document Version:** 1.0.0  
> **Classification:** Engineering Interface Contract Baseline  
> **Status:** APPROVED  
> **Authoring Lead:** API Designer & Backend Architect  
> **Review Date:** October 2026  
> **Target Base URL:** `https://api.alumniconnect.edu/api/v1` (with backward-compatible `/api/*` aliases)  

---

## 1. Global API Standards & Envelope Conventions

### 1.1 Standard Success Envelope
All successful API responses return HTTP status `200 OK` or `201 Created` with a uniform JSON envelope:
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "timestamp": "2026-10-11T12:00:00.000Z",
    "requestId": "req_8f1b2c3d4e5f"
  }
}
```

### 1.2 Standard Error Envelope
All error responses adhere to RFC 7807 problem details semantics:
```json
{
  "success": false,
  "status": "error",
  "statusCode": 403,
  "message": "Free chat window ended. Send a connection request to continue chatting.",
  "code": "CHAT_TRIAL_EXPIRED",
  "details": {
    "locked": true,
    "trialRemainingSeconds": 0
  },
  "requestId": "req_8f1b2c3d4e5f"
}
```

---

## 2. Authentication & Identity Endpoints (`API-AUTH`)

| Endpoint ID | Method | Path | Caller Role | Auth Required | Purpose & Key Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **API-AUTH-001** | `POST` | `/auth/signup` | Public | None | Register new student/alumni account. Payload: `{ email, password, name, stateId, districtId, collegeId, role, enrollmentNumber? }`. Returns `201 Created` with `{ userId, message }`. |
| **API-AUTH-002** | `POST` | `/auth/verify-otp` | Public | None | Verify 6-digit registration OTP. Payload: `{ userId, otp }`. Returns `200 OK` with `{ accessToken, user }` + Set-Cookie: `refreshToken`. |
| **API-AUTH-003** | `POST` | `/auth/resend-otp` | Public | None | Resend registration OTP email. Payload: `{ userId }`. Throttled to 1 resend per 60 seconds. Returns `200 OK`. |
| **API-AUTH-004** | `POST` | `/auth/login` | Public | None | Standard login. Payload: `{ email, password }`. Returns `200 OK` with `{ accessToken, user }` + Set-Cookie: `refreshToken`. |
| **API-AUTH-005** | `POST` | `/auth/google` | Public | None | Google OAuth sign-in / linking. Payload: `{ idToken }`. Returns `200 OK` with `{ accessToken, user }`. |
| **API-AUTH-006** | `POST` | `/auth/refresh-token` | Public | Cookie | Rotate refresh token and issue new 15m access token. Returns `200 OK` with `{ accessToken }`. |
| **API-AUTH-007** | `POST` | `/auth/logout` | Authenticated | Bearer | Revoke active refresh token and clear cookie. Returns `200 OK`. |
| **API-AUTH-008** | `POST` | `/auth/logout-all` | Authenticated | Bearer | Revoke all active sessions and increment `tokenVersion`. Returns `200 OK`. |
| **API-AUTH-009** | `POST` | `/auth/forgot-password`| Public | None | Request password reset token email. Payload: `{ email }`. Anti-enumeration generic 200 response. |
| **API-AUTH-010** | `POST` | `/auth/reset-password` | Public | None | Update password using expiring token. Payload: `{ token, newPassword }`. Returns `200 OK`. |
| **API-AUTH-011** | `GET` | `/auth/me` | Authenticated | Bearer | Fetch currently authenticated user identity and permissions. Returns `200 OK`. |

---

## 3. Geographic & Institutional Endpoints (`API-COL`)

| Endpoint ID | Method | Path | Caller Role | Auth Required | Purpose & Key Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **API-COL-001** | `GET` | `/locations/states` | Public | None | List all supported states. Returns `200 OK` with `{ states: [{ id, name, code }] }`. |
| **API-COL-002** | `GET` | `/locations/districts`| Public | None | Query districts by `?stateId=...`. Returns `200 OK` with `{ districts: [{ id, name }] }`. |
| **API-COL-003** | `GET` | `/colleges` | Public | None | Query approved colleges by `?districtId=...` or `?stateId=...`. Returns `200 OK` with `{ colleges }`. |
| **API-COL-004** | `POST` | `/colleges/requests` | Authenticated | Bearer | Submit a missing college addition ticket. Payload: `{ name, stateId, districtName, website? }`. Returns `201 Created` with ticket ID. |
| **API-COL-005** | `GET` | `/admin/colleges/requests` | Admin | Bearer | List pending college addition tickets. Query: `?status=PENDING_REVIEW`. Returns `200 OK`. |
| **API-COL-006** | `POST` | `/admin/colleges/requests/:id/approve` | Admin | Bearer | Promote college ticket to canonical database. Returns `200 OK` with new `College.id`. |

---

## 4. User Discovery & Profile Endpoints (`API-USERS`)

| Endpoint ID | Method | Path | Caller Role | Auth Required | Purpose & Key Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **API-USERS-001**| `GET` | `/users/same-college`| Authenticated | Bearer | Query alumni/students strictly belonging to caller's alma mater. Query: `?page=1&limit=20&department=&domain=`. Returns `200 OK`. |
| **API-USERS-002**| `GET` | `/users/other` | Authenticated | Bearer | Cross-college explicit discovery. Query: `?stateId=&collegeId=&domain=`. Returns `200 OK`. |
| **API-USERS-003**| `GET` | `/users/suggestions` | Authenticated | Bearer | Ranked peer recommendations based on Jaccard skill similarity and department match. Returns `200 OK`. |
| **API-USERS-004**| `GET` | `/users/:userId` | Authenticated | Bearer | Fetch public profile of specific peer with relationship status badge. Returns `200 OK`. |
| **API-USERS-005**| `PUT` | `/user/update` | Authenticated | Bearer | Update current user's profile attributes (bio, skills, interests, domain, links). Returns `200 OK`. |
| **API-USERS-006**| `DELETE`| `/user/me` | Authenticated | Bearer | Permanently delete account. Payload: `{ password }`. Cascade revokes sessions. Returns `200 OK`. |

---

## 5. Connections & Networking Endpoints (`API-CONN`)

| Endpoint ID | Method | Path | Caller Role | Auth Required | Purpose & Key Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **API-CONN-001** | `GET` | `/connections` | Authenticated | Bearer | List active connections and pending incoming requests. Returns `200 OK` with `{ connected, pending }`. |
| **API-CONN-002** | `POST` | `/connections/request`| Authenticated | Bearer | Send connection request. Payload: `{ targetUserId }`. Returns `201 Created`. |
| **API-CONN-003** | `POST` | `/connections/respond`| Authenticated | Bearer | Accept or reject request. Payload: `{ requestId, action: 'ACCEPT' \| 'REJECT' }`. Returns `200 OK`. |
| **API-CONN-004** | `DELETE`| `/connections/:userId`| Authenticated | Bearer | Disconnect / unfriend mutual connection. Returns `200 OK`. |

---

## 6. Messaging & WebRTC Calling Endpoints (`API-COMM`)

| Endpoint ID | Method | Path | Caller Role | Auth Required | Purpose & Key Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **API-COMM-001** | `GET` | `/messages` | Authenticated | Bearer | Query conversation list or messages with `?withUserId=...`. Returns decrypted messages and trial state. |
| **API-COMM-002** | `POST` | `/messages` | Authenticated | Bearer | Send direct message. Enforces 2-minute trial gate if unconnected. Returns `201 Created` or `403 Locked`. |
| **API-COMM-003** | `POST` | `/calls` | Connected User| Bearer | Initiate WebRTC voice/video call session. Payload: `{ toUserId, mode: 'VOICE' \| 'VIDEO' }`. Returns `201 Created` with `callId`. |
| **API-COMM-004** | `GET` | `/calls/:callId` | Call Participant| Bearer | Query status and duration of specific call session. Returns `200 OK`. |
| **API-COMM-005** | `POST` | `/calls/:callId/accept` | Callee | Bearer | Accept incoming call. Sets status `ACTIVE`. Returns `200 OK`. |
| **API-COMM-006** | `POST` | `/calls/:callId/reject` | Callee | Bearer | Decline incoming call. Sets status `REJECTED`. Returns `200 OK`. |
| **API-COMM-007** | `POST` | `/calls/:callId/end` | Call Participant| Bearer | Terminate active call and record duration. Returns `200 OK`. |

---

## 7. Mentorship Endpoints (`API-MENT`)

| Endpoint ID | Method | Path | Caller Role | Auth Required | Purpose & Key Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **API-MENT-001** | `GET` | `/mentorship/mentors` | Authenticated | Bearer | List available alumni mentors scoped to college. Returns `200 OK` with mentor capacity states. |
| **API-MENT-002** | `POST` | `/mentorship/request` | Student | Bearer | Submit mentorship request. Payload: `{ mentorId, requestMessage, goals: string[] }`. Returns `201 Created`. |
| **API-MENT-003** | `GET` | `/mentorship/my` | Authenticated | Bearer | Fetch active and historical mentorship sessions. Returns `200 OK`. |
| **API-MENT-004** | `PATCH`| `/mentorship/:id/accept` | Mentor | Bearer | Accept mentorship request. Checks `activeMentees < maxMentees`. Returns `200 OK`. |
| **API-MENT-005** | `PATCH`| `/mentorship/:id/complete`| Participant | Bearer | Mark mentorship session completed. Unlocks survey modal. Returns `200 OK`. |
| **API-MENT-006** | `POST` | `/mentorship/:id/survey` | Participant | Bearer | Submit post-session rating (1–5 stars) and feedback. Returns `200 OK`. |

---

## 8. Opportunities & Referrals Endpoints (`API-OPP`)

| Endpoint ID | Method | Path | Caller Role | Auth Required | Purpose & Key Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **API-OPP-001** | `GET` | `/opportunities` | Authenticated | Bearer | Browse jobs, internships, events. Filter by `?type=&domain=`. Returns `200 OK`. |
| **API-OPP-002** | `GET` | `/opportunities/matches/me`| Student | Bearer | Fetch opportunities ordered by Jaccard skill similarity score. Returns `200 OK`. |
| **API-OPP-003** | `POST` | `/opportunities` | Alumnus / Admin| Bearer | Post new job or internship. Payload: `{ title, companyName, type, description, skillsRequired, deadline, acceptingReferrals }`. Returns `201 Created`. |
| **API-OPP-004** | `POST` | `/opportunities/:id/apply` | Student | Bearer | Submit application or referral request. Payload: `{ coverNote, resumeFileId }`. Returns `201 Created`. |

---

## 9. Posts & Media Endpoints (`API-POST` & `API-UPL`)

| Endpoint ID | Method | Path | Caller Role | Auth Required | Purpose & Key Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **API-POST-001** | `GET` | `/posts` | Authenticated | Bearer | Query college feed posts, ordered by `createdAt` desc. Query: `?page=1&limit=20`. Returns `200 OK`. |
| **API-POST-002** | `POST` | `/posts` | Authenticated | Bearer | Publish new feed post. Payload: `{ title, description, type, fileUrl?, fileType? }`. Returns `201 Created`. |
| **API-POST-003** | `POST` | `/posts/:id/like` | Authenticated | Bearer | Toggle like state atomically. Returns `200 OK` with updated `likeCount`. |
| **API-POST-004** | `POST` | `/posts/:id/comment` | Authenticated | Bearer | Add comment to post. Payload: `{ content }`. Returns `201 Created`. |
| **API-UPL-001** | `POST` | `/upload/pdf` | Authenticated | Bearer | Upload PDF documents (max 15MB). Multipart stream. Returns `201 Created` with secure file URL. |
| **API-UPL-002** | `POST` | `/upload/image` | Authenticated | Bearer | Upload profile or post images (max 5MB). Multipart stream with magic-byte check. Returns `201 Created`. |

---

## 10. Moderation, Leaderboard & Notifications (`API-MOD`, `API-LEAD`, `API-NOTIF`)

| Endpoint ID | Method | Path | Caller Role | Auth Required | Purpose & Key Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **API-LEAD-001** | `GET` | `/leaderboard` | Authenticated | Bearer | Fetch top 50 ranked alumni for caller's college. Returns `200 OK` with engagement scores and badges. |
| **API-NOTIF-001**| `GET` | `/notifications` | Authenticated | Bearer | Fetch user's in-app notification history. Query: `?page=1&limit=20`. Returns `200 OK`. |
| **API-NOTIF-002**| `POST` | `/notifications/read-all`| Authenticated | Bearer | Mark all notifications as read. Returns `200 OK`. |
| **API-MOD-001** | `POST` | `/reports` | Authenticated | Bearer | File abuse report against user/content. Payload: `{ targetId, reason, notes }`. Returns `201 Created`. |
| **API-MOD-002** | `GET` | `/admin/reports` | Admin | Bearer | Fetch moderation queue of open reports. Returns `200 OK`. |
| **API-MOD-003** | `PATCH`| `/admin/users/:id/ban` | Admin | Bearer | Permanently ban user account and revoke all sessions. Returns `200 OK`. |
