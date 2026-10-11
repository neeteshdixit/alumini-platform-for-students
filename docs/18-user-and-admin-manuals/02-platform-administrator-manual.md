# Document ID: DOC-MAN-002
# Platform & Institutional Administrator Operational Manual

> **Document Version:** 1.0.0  
> **Classification:** Operational Administration Handbook  
> **Status:** APPROVED  
> **Authoring Lead:** Principal Software Architect & DevOps Engineer  
> **Review Date:** October 2026  
> **Target Audience:** College Placement Officers, University Registrars, and Platform Trust & Safety Moderators  

---

## 1. Administrative Roles & Authority Matrix

AlumniConnect partitions administrative privileges across two distinct tiers:
1. **Institutional Administrator (`INSTITUTION_ADMIN`):**
   - Typically held by University Training & Placement Officers (TPOs) and department heads.
   - Authority is strictly scoped to their assigned `collegeId`.
   - Capabilities: Review and verify student enrollment IDs; inspect graduation proofs; view institutional alumni career outcome metrics; post official campus drives.
2. **Platform System Administrator (`SYSTEM_ADMIN`):**
   - Held by platform operations, DevOps, and trust & safety teams.
   - Global authority across all institutions.
   - Capabilities: Review and approve new institution addition requests; triage cross-institution abuse reports; issue permanent account bans; monitor server health and background cron workers.

---

## 2. Institutional Addition Request Triage (`/admin/colleges`)

When a user submits an unlisted university or college, the ticket enters the Platform Admin moderation queue:

### 2.1 Inspection & Approval Procedure
1. Navigate to `/admin/colleges` and select the **"Pending Approvals"** tab.
2. For each pending ticket, inspect:
   - **College Name:** Check for spelling accuracy, canonical abbreviation, and standard university naming conventions.
   - **Geographic Placement:** Confirm state and district match official university accreditation records (e.g., UGC, AICTE, NAAC, or state board registries).
   - **Official Website & Domain:** Verify that the provided URL belongs to an authentic educational institution.
3. **Action Execution:**
   - **Approve:** Click `Approve & Create College`. The system atomically creates the canonical college entity, updates the submitter's ticket to `APPROVED`, and updates linked users.
   - **Merge / Duplicate:** If the college already exists under a slightly different name (e.g. *"IIT Bombay"* vs *"Indian Institute of Technology Bombay"*), select `Merge with Existing College` and pick the canonical entity.
   - **Reject:** If the submission is spam or fabricated, click `Reject`, input the rejection reason, and confirm.

---

## 3. Student Enrollment & Graduation Verification Queue

To maintain institutional trust, university placement officers must periodically review pending verifications:

### 3.1 Verification Procedure (`/admin/college/verifications`)
1. Filter the queue by **Department** and **Batch Year**.
2. Click on a candidate ticket to inspect:
   - Student Name and Enrollment / Roll Number.
   - Uploaded Document (Student ID card or provisional degree certificate) displayed via the secure embedded document canvas.
3. Compare the enrollment number against the university's official student roster.
4. **Approval:** Click `Verify & Grant Alumni Status`. The system executes an atomic transaction upgrading the user to `ALUMNI` and `INSTITUTION_VERIFIED`, recording the admin's identity in `verification_logs`.
5. **Rejection:** Click `Reject Proof`, select a reason (*"Illegible document"*, *"Enrollment number not found in university database"*). The candidate receives an automated re-upload prompt.

---

## 4. Abuse Moderation, Throttling & Disciplinary Protocol

### 4.1 Automated Circuit-Breaker Alerts
- Accounts receiving **5 unique reports within 14 days** are automatically placed in `RESTRICTED` mode by the system.
- An alert is flagged in the Moderation Queue (`/admin/moderation`).

### 4.2 Investigation & Disciplinary Actions
1. Open the reported user profile. Inspect the aggregate report history, report categories, and any voluntarily submitted chat evidence.
2. **Action Options:**
   - **Dismiss Report:** If the report is fraudulent or constitutes brigading, click `Dismiss`.
   - **Issue Disciplinary Warning:** Sends an official warning banner to the user's dashboard citing community standards violations.
   - **Temporary Probation (7 Days):** Restricts the user from initiating new calls or introductory messages for 7 days.
   - **Permanent Account Ban:** Click `Permanently Ban Account`.
3. **Execution of Permanent Ban:**
   - The system immediately updates `isBanned = true` and `accountStanding = BANNED`.
   - Increments `tokenVersion = tokenVersion + 1`, forcibly invalidating all outstanding JWT access tokens.
   - Revokes all active refresh tokens.
   - Emits socket event `auth:banned` terminating active WebSocket sessions.

---

## 5. System Health, Cron Observability & Operational Runbooks

### 5.1 Service Health Probes
- **Application Health:** Run `curl -i https://api.alumniconnect.edu/api/health`. Expected response: HTTP 200 `{ "status": "ok" }`.
- **Database Connection Probe:** Run `curl -i https://api.alumniconnect.edu/api/health/db`. Expected response: HTTP 200 `{ "database": "connected" }`.

### 5.2 Background Cron Job Monitoring
Administrators can inspect background job logs in Winston:
- `JOB-CRON-001 (syncGraduationStatuses)`: Monitored hourly. Search logs for `[cron] graduation sync completed`.
- `JOB-CRON-002 (cleanupExpiredOtps)`: Monitored daily at 03:00 UTC. Search logs for `[cron] purged N expired OTPs`.
- If a cron job throws an error, it is automatically logged with `level: error` and dispatched to the team Slack/PagerDuty webhook.

### 5.3 Disaster Recovery & Database Restoration
In the event of database failure:
1. Identify latest daily backup archive on S3: `s3://alumniconnect-backups/daily/db-backup-YYYY-MM-DD.dump`.
2. Provision new PostgreSQL 16 instance.
3. Restore database snapshot:
   ```bash
   pg_restore -h <db_host> -U postgres -d alumniconnect_db -v db-backup-YYYY-MM-DD.dump
   ```
4. Verify schema integrity and table counts via Prisma Studio:
   ```bash
   npm --prefix backend run prisma:studio
   ```
5. Point container `DATABASE_URL` to restored host and execute rolling restart.
