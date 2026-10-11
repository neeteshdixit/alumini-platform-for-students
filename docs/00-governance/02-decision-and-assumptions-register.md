# Document ID: DOC-GOV-003
# Master Decisions, Assumptions & Scope Register

> **Document Version:** 1.0.0  
> **Classification:** Project Governance & Architecture Baseline  
> **Status:** APPROVED  
> **Owner:** Senior Business Analyst & Principal Software Architect  
> **Last Updated:** October 2026  
> **Applies to:** AlumniConnect Platform Specification Baseline  

---

## 1. Master Decision Register

This register records every major architectural, functional, security, and operational fork. No assumption is converted into a confirmed requirement without explicit tracking here.

| Decision ID | Domain | Decision Title & Context | Alternatives Evaluated | Final Decision / Recommendation | Status | Approver Role | Impacted Modules |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **DEC-001** | Architecture | **Persistence & Database Engine**<br>Need scalable ACID transactions, relational integrity, and spatial/search capabilities. | 1. MongoDB (Document)<br>2. MySQL<br>3. PostgreSQL | **PostgreSQL 16+ via Prisma ORM** with native UUIDs, JSONB for extensible metadata, and full-text search indexes. | **APPROVED** | Database Architect | MOD-ALL, MOD-DAT |
| **DEC-002** | Security | **Institution Addition Governance**<br>How user-submitted colleges become available in the database. | 1. Auto-commit on submit (current defect)<br>2. Strict pre-moderation queue<br>3. Crowdsourced voting | **Pre-moderation Approval Queue:** User submissions create an `InstitutionAdditionRequest` record; college becomes selectable only after Admin approval. | **PROPOSED** | Product Manager | MOD-COL, MOD-ADM |
| **DEC-003** | Security | **Identity & Role Domain Modeling**<br>Single overloaded role enum vs multi-dimensional attribute modeling. | 1. Single `Role` enum (STUDENT, ALUMNI, ADMIN)<br>2. Multi-dimensional model | **Multi-Dimensional Modeling:** Separate `PlatformRole`, `AcademicStatus`, `VerificationTier`, and `AccountStanding` to prevent privilege escalation. | **APPROVED** | Security Engineer | MOD-AUTH, MOD-SEC |
| **DEC-004** | Security | **Chat Encryption & Security Model**<br>Server-side database encryption vs End-to-End Encryption (E2EE). | 1. Client-side E2EE (Signal Protocol)<br>2. Server-side AES-256-GCM at rest<br>3. Plaintext storage | **Server-side AES-256-GCM field encryption at rest** + WSS/TLS in transit for MVP. E2EE labeled as future roadmap due to key escrow and group complexity. | **APPROVED** | Application Security Engineer | MOD-CHAT, MOD-SEC |
| **DEC-005** | Networking | **Introductory Chat Duration & Enforcement**<br>How to prevent spam while enabling introductory student-alumni outreach. | 1. Strict connection required before any message<br>2. Unlimited open chat<br>3. Server-enforced 2-minute introductory window | **Server-Enforced 2-Minute Window:** Non-connected users can message for exactly 120 seconds from the first message timestamp. Server strictly locks sending upon expiry. | **APPROVED** | Product Manager | MOD-CHAT, MOD-CONN |
| **DEC-006** | Product | **Discovery Scoping & Multi-College Separation**<br>How users discover alumni from own college vs other colleges. | 1. Merged global feed<br>2. Strict same-college only<br>3. Isolated default same-college with opt-in cross-college tab | **Strict Default Isolation:** Discovery page defaults 100% to verified same-college alumni. "Other Colleges" is an explicit secondary tab with state/college filters. | **APPROVED** | UX Architect | MOD-DISC, MOD-UX |
| **DEC-007** | Operations | **File Upload & Asset Storage Strategy**<br>Local disk storage vs Cloud Object Storage with signed URLs. | 1. Local filesystem with static serving (current defect)<br>2. AWS S3 / Cloudflare R2 with private pre-signed URLs | **Private Object Storage with Pre-Signed URLs:** S3/R2 private buckets. Resumes, ID docs, and attachments require authenticated expiring signed URLs. | **APPROVED** | DevOps Engineer | MOD-UPL, MOD-SEC |
| **DEC-008** | Real-Time | **WebRTC Call Architecture & Signaling**<br>P2P Mesh vs Selective Forwarding Unit (SFU) vs Third-Party SDK (Agora). | 1. 1-on-1 P2P WebRTC with Socket.IO signaling + STUN/TURN<br>2. Mediasoup SFU<br>3. Twilio/Agora | **1-on-1 P2P WebRTC with Coturn STUN/TURN** for MVP voice/video calls. SFU deferred to group call milestone. | **APPROVED** | Backend Architect | MOD-CALL, MOD-ARC |
| **DEC-009** | Quality | **Automated Testing Suite Framework**<br>Selection of test runners for backend API and frontend component/E2E testing. | 1. Jest + Enzyme<br>2. Vitest + Supertest + Playwright<br>3. Manual testing only | **Vitest + Supertest (Backend)** and **Vitest + Testing Library + Playwright (Frontend)** with strict CI quality gates (minimum 80% branch coverage on auth). | **APPROVED** | QA Architect | MOD-TST, MOD-OPS |
| **DEC-010** | Lifecycle | **Graduation & Alumni Transition Workflow**<br>How students transition to alumni status upon graduation. | 1. Silent cron mutation (current defect)<br>2. Formal verification workflow with document proof | **Documented Verification Transition:** Passing graduation date triggers a `GRADUATION_REVIEW` notification. Role changes to `ALUMNI` only upon proof verification. | **APPROVED** | Product Manager | MOD-LIFE, MOD-VERIF |
| **DEC-011** | Integration | **LinkedIn Integration Scope**<br>Official LinkedIn OAuth API capabilities vs manual achievement entry. | 1. Web scraping<br>2. Official LinkedIn OAuth (`openid, profile, email`)<br>3. Manual portfolio entry with verified link | **Official LinkedIn OAuth for profile linking** + Manual achievement entry with URL verification. Explicitly prohibit scraping to protect platform compliance. | **DECISION REQUIRED** | Product Owner | MOD-INT, MOD-PROF |
| **DEC-012** | Moderation | **Reporting & Abuse Resolution Workflow**<br>Automated account suspension vs human review queue. | 1. Immediate ban upon N reports<br>2. Dual-threshold: automated throttle at 5 reports, admin review before permanent ban | **Dual-Threshold Moderation:** 5 unique reports place user in restricted mode (cannot initiate new chats/calls) pending admin triage and permanent decision. | **APPROVED** | Security Engineer | MOD-MOD, MOD-ADM |

---

## 2. Master Assumptions Register

The following assumptions govern the baseline engineering specifications. Each assumption includes an explicit validation method and risk impact analysis.

| Assumption ID | Statement | Rationale | Validation Method | Risk if Assumption is Invalid | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **ASM-001** | Target institutions operate on standard 2 to 4-year undergraduate and postgraduate degree cycles. | Common academic framework across universities globally. | Review institutional degree registries during onboarding. | Minor: Non-traditional degree formats may need custom graduation calculation logic. | **ACTIVE** |
| **ASM-002** | Participating universities do not provide direct registrar API access for real-time enrollment validation. | Most universities lack open, standardized student information system (SIS) APIs. | Field interviews with university administration. | Medium: Manual document verification creates operational overhead for platform reviewers. | **ACTIVE** |
| **ASM-003** | The primary deployment environment is a cloud Linux container platform (Docker / Kubernetes on AWS or GCP). | Standard cloud containerization provides necessary elasticity and service isolation. | Verify DevOps pipeline infrastructure configuration. | Low: Platform can run on any Docker-compliant VPS or managed container service. | **ACTIVE** |
| **ASM-004** | Most student-alumni video and audio calls are bilateral (1-on-1) mentorship or mock interview sessions. | Initial user research indicates group calls are rare during early mentorship matching. | Analytics tracking on call duration and participant counts. | Medium: If group webinars are demanded, an SFU media server must be prioritized sooner. | **ACTIVE** |
| **ASM-005** | Official LinkedIn API does not grant open access to user feed posts, full work history updates, or automated certificate scraping. | LinkedIn Developer Portal policies strictly restrict `r_member_social` and partner-level profile sync scopes. | Review LinkedIn Developer Portal OAuth 2.0 scope documentation. | Critical: Users must be informed that achievement sync requires manual confirmation. | **ACTIVE** |
| **ASM-006** | Student users have access to smartphones or laptops equipped with standard WebRTC-capable web browsers (Chrome, Firefox, Safari, Edge). | Standard modern browser compatibility matrix across mobile and desktop. | Browser user-agent analytics telemetry. | Low: Legacy browsers require explicit compatibility warning banners. | **ACTIVE** |
| **ASM-007** | Transactional email delivery via Resend (or SendGrid/AWS SES) will maintain a 99%+ inbox placement rate for OTPs. | Industry-standard transactional email delivery providers. | DMARC, DKIM, and SPF domain configuration checks. | High: Undelivered OTP emails completely block user registration and account recovery. | **ACTIVE** |

---

## 3. Product Scope & Boundary Definitions

To ensure strict engineering discipline and prevent feature bloat during Phase 1-8 execution, platform capabilities are formally partitioned into release tiers.

### 3.1 Tier 1: In-Scope for Milestone 1.0 (Core Foundation & Academic Project Baseline)
1. **Institutional Governance:** State & District hierarchical college selection; pre-moderation college addition request workflow.
2. **Identity & Auth:** Local email/password signup with OTP email verification; Google OAuth sign-in; refresh token rotation; session revocation; password reset lifecycle.
3. **Multi-Dimensional Profiles:** Student and Alumni profiles (education, skills, interests, bio, experiences, achievements, portfolio links).
4. **Isolated Same-College Discovery:** Directory defaulting exclusively to same-college students and alumni, with branch and batch filters.
5. **Connection Network:** Send, accept, reject, and withdraw connection requests.
6. **Time-Bounded Messaging:** One-on-one text messaging with real-time Socket.IO delivery, typing indicators, read receipts, and server-enforced 2-minute introductory window for unconnected users.
7. **P2P Audio/Video Calling:** 1-on-1 WebRTC calling with Socket.IO signaling, ring state management, and duration tracking.
8. **Academic Social Feed:** Text posts with single/multiple image attachments and native PDF certificate previewing; likes and threaded comments.
9. **Opportunities Hub:** Post and browse Jobs, Internships, and Hackathons/Events; apply with cover note; profile skill-matching algorithm.
10. **Alumni Engagement Leaderboard:** College-scoped engagement scoring based on verified activity.
11. **Safety & Moderation:** Block user, file report with reason code, basic admin moderation queue.
12. **Notifications Hub:** In-app real-time notification drawer and unread badge count.

### 3.2 Tier 2: In-Scope for Milestone 2.0 (Startup Scaling & Career Acceleration)
1. **Mentorship Marketplace:** Mentor calendar availability slots, structured booking workflow, session goals, post-session notes, and rating surveys.
2. **Formal Referral Pipeline:** Verified alumni referral requests with resume attachment and referral status tracking (Requested -> Reviewed -> Submitted -> Interview).
3. **Institutional Admin Portal:** Dedicated dashboard for university placement officers to verify student enrollments in bulk via CSV or administrative review.
4. **Experience Threads & College Timeline:** Historical institutional timeline mapping alumni career trajectories by department and graduation year.
5. **Ask for Help (Q&A Forum):** Structured academic and career assistance board with domain-specific tagging and reputation points.
6. **STUN/TURN High-Availability Cluster:** Globally distributed TURN relay infrastructure for symmetric NAT traversal.

### 3.3 Out-of-Scope (Explicitly Excluded from Current Releases)
1. **Direct SIS/ERP Database Sync:** Automated SQL/REST syncing with proprietary university software (e.g., Ellucian Banner, PeopleSoft) is excluded due to lack of standard APIs.
2. **Third-Party LinkedIn Data Scraping:** Automated background scraping of LinkedIn profiles without official user authorization is strictly excluded to prevent legal and security violations.
3. **Payment Gateway & Paid Mentorship:** Monetized mentorship transactions are excluded from Milestone 1.0 and 2.0 to preserve non-commercial academic networking compliance.
4. **Group Video Conferencing (SFU/MCU):** Multi-party group video calls (>2 participants) are excluded; platform focuses exclusively on bilateral 1-on-1 sessions.
5. **Native Mobile Applications (iOS / Android):** Native Swift/Kotlin or React Native binaries are deferred; platform is delivered as a fully responsive Progressive Web App (PWA).
