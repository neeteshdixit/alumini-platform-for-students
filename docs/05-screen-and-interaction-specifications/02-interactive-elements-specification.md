# Document ID: DOC-UI-002
# Interactive UI Elements & Behavior Specification

> **Document Version:** 1.0.0  
> **Classification:** Frontend Engineering & Interaction Architecture  
> **Status:** APPROVED  
> **Authoring Lead:** Frontend Architect & API Designer  
> **Review Date:** October 2026  
> **Target System:** AlumniConnect Platform Specification  

---

## 1. Specification Framework

This document specifies the exact behavior of every meaningful interactive UI control across the platform. In conformance with **Master Prompt Section 6.4**, every interaction is documented with its client triggers, validation rules, backend endpoints, database modifications, duplicate prevention, and accessibility behavior.

---

## 2. Interactive Element Catalog

### INT-AUTH-LOGIN-001: Email/Password Login Submission Button
- **Parent Screen & Component:** `SCR-AUTH-001` -> `<AuthCard>`
- **Visible Label:** `"Sign In"` (or `"Signing in..."` when loading)
- **User Role & Access:** Public (Anonymous).
- **Initial State:** Enabled.
- **Enabled/Disabled Conditions:** Disabled if either `email` or `password` input is empty or if submission is currently in flight.
- **Trigger:** Mouse click or `Enter` keypress inside form fields.
- **Immediate Frontend Response:** Button switches to loading state with spinning SVG indicator; form inputs become `readOnly`.
- **Validation Performed:** Client validates email format with regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`; password non-empty.
- **Confirmation Required:** None.
- **Route Destination:** Redirects to `/dashboard` upon HTTP 200 response.
- **API Endpoint:** `POST /api/v1/auth/login`
- **HTTP Method:** `POST`
- **Request Payload:** `{ email: string, password: string }`
- **Backend Service Responsibility:** `auth.controller.js` invokes `login()`:
  - Fetches user record by email.
  - Verifies account is not locked (`lockedUntil <= now()`).
  - Executes `bcrypt.compare(password, user.passwordHash)`.
  - On failure: increments `failedLoginAttempts`. If $\ge 5$, sets `lockedUntil = now + 15 min`.
  - On success: resets `failedLoginAttempts = 0`, updates `lastLoginAt = now()`.
  - Generates JWT access token (15m) and refresh token (7d).
- **Authorization Checks:** None (public auth endpoint). Rate-limited to 5 requests per 15 minutes per IP.
- **Database Reads/Writes:** Reads `users` table; updates `users.failed_login_attempts`, `users.locked_until`, `users.last_login_at`; inserts into `refresh_tokens`.
- **Events / Background Jobs:** Dispatches audit log `AUTH_LOGIN_SUCCESS` or `AUTH_LOGIN_FAILED`.
- **Notifications Generated:** None (login alert email sent only if new IP/device detected).
- **Loading Behavior:** Submit button disabled; spinner rendered.
- **Success Behavior:** Stores access token in Zustand `authStore`; sets HTTP-only `refreshToken` cookie; triggers green toast: *"Welcome back, [Name]!"*; navigates to `/dashboard`.
- **Error Behavior:** If credentials invalid, renders floating banner: *"Invalid email or password. [N] attempts remaining."* Focus shifts to email input.
- **Duplicate Prevention:** Form submission handler sets `isSubmitting = true` synchronously before asynchronous network dispatch.
- **Accessibility:** `type="submit"`; operable via keyboard `Enter`.
- **Related Test IDs:** `TEST-AUTH-LOGIN-001`, `TEST-AUTH-LOGIN-002`.

---

### INT-COL-SELECT-001: Geographic District Cascade Dropdown
- **Parent Screen & Component:** `SCR-AUTH-001` -> `<CollegeSelector>`
- **Visible Label:** `"Select District"`
- **User Role & Access:** Public / All Users.
- **Initial State:** Disabled with placeholder `"Select State first"`.
- **Enabled/Disabled Conditions:** Enables immediately upon user selecting a valid `stateId`. Disables and resets if state selection is cleared.
- **Trigger:** Mouse click or keyboard arrow selection on `<select>` element.
- **Immediate Frontend Response:** Resets child College dropdown to empty; shows loading spinner inside dropdown.
- **Validation Performed:** Verifies `stateId` is a valid UUID format.
- **Route Destination:** Local component state update (no navigation).
- **API Endpoint:** `GET /api/v1/locations/districts?stateId=:stateId`
- **HTTP Method:** `GET`
- **Backend Service Responsibility:** `locations.controller.js` queries `LocationDistrict` entities matching `stateId`, ordered alphabetically by `name`.
- **Authorization Checks:** Public endpoint.
- **Database Reads:** `location_districts` table query with index `@@index([stateId, name])`.
- **Loading Behavior:** Dropdown displays text: `"Loading districts..."`.
- **Success Behavior:** Populates `<option>` elements with districts for selected state.
- **Error Behavior:** Renders error notice: *"Failed to load districts. Click to retry."*
- **Accessibility:** Focusable via `Tab`; options selectable via `ArrowUp` / `ArrowDown`; labeled via `<label htmlFor="district-select">`.
- **Related Test IDs:** `TEST-COL-003`.

---

### INT-DISC-CONNECT-001: Send Connection Request Button
- **Parent Screen & Component:** `SCR-DIR-001` -> `<AlumniCard>` / `SCR-PROF-002`
- **Visible Label:** `"Connect"`
- **User Role & Access:** Authenticated Student / Alumnus (`role: STUDENT | ALUMNI`).
- **Initial State:** Visible and enabled when `connectionStatus === 'NONE'`.
- **Enabled/Disabled Conditions:** Disabled if request is in flight or if target user is current session user.
- **Trigger:** Mouse click or `Space`/`Enter` keypress.
- **Immediate Frontend Response:** Button label changes to `"Connecting..."`; spinner displayed.
- **Validation Performed:** Verifies target user ID is valid and not blocked.
- **Confirmation Required:** None.
- **Route Destination:** Local card state updates to `"Request Sent"`.
- **API Endpoint:** `POST /api/v1/connections/request`
- **HTTP Method:** `POST`
- **Request Payload:** `{ targetUserId: string }`
- **Backend Service Responsibility:** `connections.controller.js` invokes `sendConnectionRequest()`:
  - Verifies target user exists and neither user has blocked the other.
  - Inserts `ConnectionRequest` with `status: PENDING`.
  - Creates in-app `Notification` (`type: CONNECTION_REQUEST`).
  - Emits real-time Socket.IO event `notification:new` to room `user:${targetUserId}`.
- **Authorization Checks:** `requireAuth` middleware verifies valid JWT access token.
- **Database Reads/Writes:** Reads `users`, `blocks`, `connection_requests`; inserts `connection_requests` and `notifications`.
- **Loading Behavior:** Button shows spinner and `disabled` attribute applied.
- **Success Behavior:** Button transitions to an amber badge: `"Request Sent"` with an option to `"Withdraw"`. Toast: *"Connection request sent to [Name]."*
- **Error Behavior:** If request already pending, returns HTTP 409: *"A connection request is already pending."* Button updates to reflect actual state.
- **Duplicate Prevention:** Immediate mutation state lock via TanStack Query mutation lifecycle.
- **Accessibility:** `aria-label="Send connection request to [Name]"`.
- **Related Test IDs:** `TEST-CONN-001`.

---

### INT-CONN-ACCEPT-001: Accept Connection Request Action Button
- **Parent Screen & Component:** `SCR-DASH-001` -> `<PendingRequestsWidget>`
- **Visible Label:** `"Accept"`
- **User Role & Access:** Authenticated Recipient of connection request.
- **Initial State:** Enabled.
- **Trigger:** Mouse click or keyboard trigger.
- **Immediate Frontend Response:** Request card animates with optimistic accepted badge.
- **API Endpoint:** `POST /api/v1/connections/respond`
- **HTTP Method:** `POST`
- **Request Payload:** `{ requestId: string, action: 'ACCEPT' }`
- **Backend Service Responsibility:** `connections.controller.js` invokes `acceptOrRejectConnection()`:
  - Verifies caller is the designated `receiverId` on the request.
  - Updates `connection_requests.status = ACCEPTED`, sets `respondedAt = now()`.
  - Dispatches `CONNECTION_ACCEPTED` notification to requester.
  - Emits Socket event `connection:accepted` to requester socket room.
- **Authorization Checks:** Valid JWT; caller matches `receiverId`.
- **Database Reads/Writes:** Updates `connection_requests` table; inserts `notifications`.
- **Success Behavior:** Card removes from pending widget; connection count increments by 1; toast: *"You are now connected with [Name]!"*. Unlocks unlimited chat and calling permissions.
- **Error Behavior:** If request was withdrawn by sender, returns HTTP 404: *"Request no longer exists."* Card smoothly animates out.
- **Related Test IDs:** `TEST-CONN-002`.

---

### INT-CHAT-SEND-001: Chat Message Send Button
- **Parent Screen & Component:** `SCR-MSG-001` -> `<MessageInputBar>`
- **Visible Label:** Paper plane send icon / `"Send"`
- **User Role & Access:** Authenticated participant in the active chat.
- **Initial State:** Disabled when textarea draft is empty.
- **Enabled/Disabled Conditions:** Enables when `draft.trim().length > 0` AND chat is not locked. Disabled if trial timer expired.
- **Trigger:** Click send icon or press `Enter` (without `Shift` key).
- **Immediate Frontend Response:** Message appended optimistically to message feed with a temporary clock icon; draft textarea cleared; typing indicator stopped.
- **Validation Performed:** `content.trim().length <= 4000`.
- **API Endpoint:** `POST /api/v1/messages`
- **HTTP Method:** `POST`
- **Request Payload:** `{ toUserId: string, content: string }`
- **Backend Service Responsibility:** `messages.controller.js`:
  - Checks if users are connected.
  - If unconnected: checks `getChatAccessState()`. If elapsed time $> 120\text{s}$, rejects write with HTTP `403 Forbidden` (`{ locked: true }`).
  - If permitted: encrypts content using server AES-256-GCM.
  - Inserts `Message` record. Updates `Chat.lastMessageAt`.
  - Emits real-time Socket.IO event `message:new` to room `chat:${chatId}`.
- **Authorization Checks:** Valid JWT; caller is an authorized participant.
- **Database Reads/Writes:** Queries `chats`, `connection_requests`, `messages`; inserts into `messages`.
- **Success Behavior:** Optimistic message clock icon replaced with single grey checkmark (`Delivered`).
- **Error Behavior (Trial Expired):** HTTP 403 returned. Optimistic message marked with red exclamation mark (*"Failed to send: 2-minute introductory window ended"*). Textarea locks.
- **Accessibility:** `aria-label="Send message"`; `Enter` sends message, `Shift+Enter` inserts newline.
- **Related Test IDs:** `TEST-CHAT-001`, `TEST-CHAT-002`.

---

### INT-CALL-START-001: Start Video Call Button
- **Parent Screen & Component:** `SCR-MSG-001` -> `<ChatHeader>` / `<CallWindow>`
- **Visible Label:** Camera icon / `"Video Call"`
- **User Role & Access:** Connected user or authorized peer.
- **Initial State:** Enabled if users are connected and no active call is ongoing.
- **Enabled/Disabled Conditions:** Disabled if call provider is currently busy (`callBusy === true`) or if users are unconnected.
- **Trigger:** Mouse click.
- **Immediate Frontend Response:** Browser requests camera/microphone permissions; full-screen call overlay opens with ringing tone.
- **API Endpoint:** `POST /api/v1/calls`
- **HTTP Method:** `POST`
- **Request Payload:** `{ toUserId: string, mode: 'VIDEO' }`
- **Backend Service Responsibility:** `calls.controller.js`:
  - Validates callee is online and not engaged in another call.
  - Inserts `CallSession` (`status: RINGING`).
  - Emits `call:incoming` via Socket.IO to callee.
- **Authorization Checks:** Valid JWT; users must be connected.
- **Success Behavior:** Overlay shows pulsing avatar and audio ringing tone.
- **Error Behavior:** If callee is offline or busy, returns HTTP 486: *"User is currently busy on another call."* Overlay closes with toast notice.
- **Accessibility:** Labeled `aria-label="Start video call with [Name]"`.
- **Related Test IDs:** `TEST-CALL-001`.

---

### INT-CALL-END-001: End Active Call Button
- **Parent Screen & Component:** `SCR-CALL-001` -> `<CallControls>`
- **Visible Label:** Phone hangup icon (Red circular button)
- **User Role & Access:** Participant in an active WebRTC call.
- **Trigger:** Click or press `Esc`.
- **Immediate Frontend Response:** Stops camera/microphone hardware tracks; closes WebRTC `RTCPeerConnection`; closes call modal.
- **API Endpoint:** `POST /api/v1/calls/:callId/end` (and Socket.IO event `call:end`)
- **Backend Service Responsibility:** Updates `CallSession.status = ENDED`, computes `durationSeconds = now - acceptedAt`. Emits `call:ended` to peer.
- **Success Behavior:** Overlay dismissed; call duration logged in direct chat timeline.
- **Related Test IDs:** `TEST-CALL-002`.

---

### INT-POST-CREATE-001: Publish Academic Post Button
- **Parent Screen & Component:** `SCR-DASH-001` -> `<CreatePostModal>`
- **Visible Label:** `"Publish Post"`
- **User Role & Access:** Authenticated Student / Alumnus.
- **Initial State:** Disabled when title or description is empty.
- **Trigger:** Click or `Ctrl+Enter`.
- **Immediate Frontend Response:** Modal shows submission progress spinner.
- **Validation Performed:** `title` (3–200 chars), `description` (10–5000 chars), attachments verified.
- **API Endpoint:** `POST /api/v1/posts`
- **HTTP Method:** `POST`
- **Request Payload:** `{ title, description, type, fileUrl, fileType }`
- **Backend Service Responsibility:** Inserts `Post` record; links uploaded `post_files`; broadcasts `feed:new_post` via Socket.IO.
- **Success Behavior:** Modal closes; new post appears at the top of feed with celebratory audio chime; toast: *"Post published to your college feed!"*.
- **Related Test IDs:** `TEST-POST-001`.

---

### INT-POST-LIKE-001: Post Like Toggle Button
- **Parent Screen & Component:** `SCR-DASH-001` -> `<FeedPostCard>`
- **Visible Label:** Heart icon + Like Counter (e.g. `♥ 14`)
- **Initial State:** Unliked (grey heart) or Liked (red heart).
- **Immediate Frontend Response:** Optimistically toggles heart color and increments/decrements like counter by 1. Synthesizes subtle audio pop sound.
- **API Endpoint:** `POST /api/v1/posts/:postId/like`
- **HTTP Method:** `POST`
- **Backend Service Responsibility:** Atomic transaction: if `PostLike` exists, deletes record and decrements `post.like_count`; if not, inserts record and increments `like_count`.
- **Success Behavior:** Counter synchronized with server response.
- **Error Behavior:** If mutation fails, reverts optimistic state to original count and displays error toast.
- **Related Test IDs:** `TEST-POST-002`.

---

### INT-THEME-TOGGLE-001: Light / Dark Mode Toggle Button
- **Parent Screen & Component:** `SCR-DASH-001` -> `<ThemeToggle>`
- **Visible Label:** Sun icon (Light mode) / Moon icon (Dark mode)
- **User Role & Access:** All Users.
- **Trigger:** Click.
- **Immediate Frontend Response:** Toggles HTML `dark` class on root document element; updates DaisyUI `data-theme` attribute between `"light"` and `"dark"`.
- **Storage:** Persists user preference in `localStorage.getItem('alumni_theme')`.
- **API Endpoint:** None (purely local client-side interaction).
- **Accessibility:** Labeled `aria-label="Switch to dark mode"` / `"Switch to light mode"`.
