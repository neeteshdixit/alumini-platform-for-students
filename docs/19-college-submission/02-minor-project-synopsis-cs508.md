# Minor Project-I (CS-508) Synopsis

> **Course:** Minor Project-I (CS-508)  
> **Class & Semester:** CS-1, V Semester  
> **Submission Deadline:** On or before 28/09/2026  
> **Document Type:** Official Academic Synopsis  
> **Corresponding Word File:** [`Minor_Project_I_CS508_Synopsis.docx`](file:///d:/Projects/alumini-platform-for-students-1/docs/19-college-submission/Minor_Project_I_CS508_Synopsis.docx)  
> **Formatting Compliance:** Times New Roman, 1.5 Line Spacing, Justified, Exact Word Limits  

---

<div align="center">

# ALUMNICONNECT: AN INSTITUTION-CENTRIC PROFESSIONAL NETWORKING, VERIFIED MENTORSHIP AND CAREER ACCELERATION PLATFORM

**Name of the student1 (Enrollment No.), Name of the student2 (Enrollment No.),**  
**Name of the student3 (Enrollment No.),**  
*Email-ID of the student1, Email-ID of the student2, Email-ID of the student3*  

</div>

---

### Abstract (100 Words Approx.)
Higher education institutions face a substantial disconnect between enrolled undergraduates and their graduated alumni network. Traditional professional networking platforms suffer from self-reported, unverified affiliations, cold-outreach spam, and lack of institutional context. This project proposes AlumniConnect, a secure, college-centric networking and career acceleration ecosystem designed exclusively for verified collegiate communities. The solution introduces canonical institutional governance, strict alma-mater discovery isolation, server-gated introductory messaging, structured mentorship workspaces, and alumni-driven referral pipelines. Built on a modern web stack with relational integrity and role-based access control, the expected outcome is an authentic, trusted institutional bridge that significantly empowers students in career mentoring, internship referrals, and professional guidance.

---

### 1. Introduction (200 Words Approx.)
The higher education sector relies heavily on institutional social capital to drive student employability, career clarity, and technological skill adaptation. Alumni networks represent an institution's most valuable external asset, serving as mentors, industry guides, and hiring conduits. However, the current digital networking paradigm is dominated by generalized public networks such as LinkedIn and ad-hoc communication channels like WhatsApp or Telegram groups. While public platforms facilitate broad commercial visibility, they inherently lack institutional trust boundaries, academic affiliation verification, and structured engagement channels. Consequently, student outreach to alumni on commercial platforms frequently results in low response rates, recruiter noise, and impersonal interactions. Conversely, informal messaging groups suffer from severe information dilution, privacy leakages, and lack of searchable opportunity records. Research in academic networking systems indicates that meaningful mentorship thrives when built upon shared collegiate identity, verified academic lineage, and institutional belonging. Bridging the gap between undergraduate learners and established industry alumni requires a purpose-built academic networking ecosystem that formalizes institutional relationships into persistent, productive career dialogues. Providing a dedicated collegiate networking space elevates university placement outcomes, preserves institutional legacy, and establishes a sustainable culture of academic reciprocity across consecutive student cohorts.

---

### 2. Problem Domain (150 Words Approx.)
Current academic-alumni interaction mechanisms suffer from critical structural deficiencies that hinder effective collegiate engagement:

1. **Identity and Trust Deficit:** Existing networks rely on self-declared affiliations, allowing impersonation and unverified claims of alumni status.
2. **Discovery Boundary Pollution:** Students cannot filter alumni strictly by shared department, graduation lineage, or institutional campus.
3. **Unregulated Outreach Dynamics:** Open direct messaging leads to unsolicited spam, while cold outreach leaves alumni overwhelmed without clear interaction boundaries.
4. **Fragmented Opportunity Channels:** Internship postings, referrals, and career sessions are lost in unindexed chat threads without accountability.

**Objectives of the Proposed Project:**
1. To engineer a secure, verified institutional identity framework enforcing multi-dimensional role separation.
2. To implement an alma-mater discovery engine providing strict same-college isolation.
3. To design time-bounded introductory messaging and real-time audio/video communication protocols.
4. To establish structured mentorship workspaces with goal tracking and peer-to-peer referral pipelines.
5. To provide institutional administrators with governance oversight, verification queues, and audit telemetry.

---

### 3. Solution Domain (200 Words Approx.)
AlumniConnect is architected as an enterprise-grade client-server web platform utilizing a layered modular architecture. The solution implements a strict 3-tier institutional hierarchy (State -> District -> College) ensuring canonical identity through verified unique college identifiers. For authentication, a dual-token cryptographic scheme combines 15-minute stateless JWT access tokens with rotating, hashed refresh tokens stored in a relational PostgreSQL schema, incorporating automatic reuse detection. Access control enforces a multi-dimensional domain model separating platform roles, academic standing, and verification tiers.

The discovery engine employs attribute-based SQL indexing to isolate alumni recommendations to the user's specific alma mater, computing career compatibility through Jaccard skill-matching algorithms. For secure communication, a WebSocket layer powered by Socket.IO manages real-time messaging, protected at rest by AES-256-GCM field encryption. To resolve cold-outreach abuse, an introductory chat state machine enforces a server-side 120-second Redis TTL timer before requiring mutual connection acceptance. WebRTC signaling coordinates peer-to-peer voice and video sessions, supported by a Coturn STUN/TURN relay for symmetric NAT traversal. Furthermore, background job workers orchestrate email verification, graduation reviews, and referral status updates through a transactional outbox pattern, guaranteeing system resilience and transactional integrity.

---

### 4. System Domain (100 Words Approx.)
The platform is developed using React 19 and Vite for a reactive single-page frontend, styled with Tailwind CSS v4 and DaisyUI for responsive WCAG-compliant design. The backend leverages Node.js with Express and Prisma ORM, selected for non-blocking I/O and rapid event execution. PostgreSQL serves as the relational database, chosen for strict ACID compliance, relational integrity, and robust foreign-key constraints. Redis provides low-latency caching and TTL session state management. Socket.IO and WebRTC handle bidirectional signaling and multimedia streaming. Containerized deployment is managed via Docker, requiring minimum specifications of a Dual-Core CPU, 4 GB RAM, and 20 GB SSD storage.

---

### 5. Application Domain (100 Words Approx.)
AlumniConnect is primarily applicable across engineering colleges, universities, and multi-campus higher education institutes seeking to institutionalize alumni engagement and placement readiness. Variants of the system extend to autonomous polytechnics, postgraduate business schools, and centralized university placement cells. In real-world application, the platform democratizes corporate referral access for students from tier-2 and tier-3 institutions who lack legacy networking connections. For alumni, it offers an organized, respectful avenue to give back to their alma mater without risking personal communication fatigue. For universities, it elevates accreditation metrics (such as NAAC and NBA) by demonstrating verifiable alumni collaboration and structured student career progression.

---

### 6. Expected Outcome (60 Words Approx.)
The expected outcomes of the proposed project are:
1. A deployed, responsive web platform enabling verified student-alumni networking.
2. A verified institutional database supporting cascading college discovery and moderation.
3. Functional real-time messaging with a server-enforced two-minute introductory window.
4. Integrated WebRTC video calling and structured mentorship workspaces.
5. An active alumni opportunity and referral radar with resume preview capabilities.
6. Centralized moderation dashboards ensuring student safety and community trust.

---

<br/>

**Name of Guide: Dr. / Prof. ....................................................**  
**Sign of Guide with Date: ....................................................**  
