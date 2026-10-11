# Document ID: DOC-API-002
# Socket.IO Real-Time Event Contracts & Protocols

> **Document Version:** 1.0.0  
> **Classification:** Real-Time Interface Specification  
> **Status:** APPROVED  
> **Authoring Lead:** Backend Architect & API Designer  
> **Review Date:** October 2026  
> **Target Gateway:** Socket.IO v4 Server (`createSocketServer`)  

---

## 1. Gateway Connection & Handshake Authentication

### 1.1 Handshake Protocol
Every client establishing a WebSocket connection must provide a valid JWT access token during the handshake phase:
- **Client Configuration (`SocketContext.jsx`):**
  ```javascript
  const socket = io('https://api.alumniconnect.edu', {
    auth: { token: accessToken },
    transports: ['websocket'],
    withCredentials: true,
  });
  ```
- **Server Authentication Middleware (`socket.handler.js`):**
  - Token verified against `env.jwtAccessSecret`.
  - On verification failure: Handshake rejected immediately with `Error('Unauthorized')`.
  - On verification success: Decoded claims stored in `socket.data.user = { userId, collegeId, role }`.

### 1.2 Room Multiplexing
Upon successful authentication, the server automatically assigns the socket to private channels:
1. `user:${socket.data.user.userId}`: Dedicated unicast room for user-targeted notifications and incoming call rings.
2. `college:${socket.data.user.collegeId}`: Broadcast channel for institutional feed updates and graduation milestones.
3. `chat:${chatId}`: Joined dynamically via `joinChat` event after verifying chat participation.
4. `call:${callId}`: Joined dynamically during active WebRTC call sessions.

---

## 2. Client-to-Server (C2S) Event Specifications

| Event Name | Parameter Schema | Handler Responsibility & Validation | Database Impact |
| :--- | :--- | :--- | :--- |
| **`joinChat`** | `{ chatId: string }` | Validates caller is a member of `chat_participants` for `chatId`. If verified, joins room `chat:${chatId}`. | None (In-memory room join). |
| **`typing`** | `{ chatId: string }` | Relays ephemeral typing broadcast to `socket.to(chat:${chatId})`. Excludes sender socket. | None (Zero DB writes). |
| **`stopTyping`** | `{ chatId: string }` | Relays ephemeral stop typing broadcast to room. | None (Zero DB writes). |
| **`call:join`** | `{ callId: string }` | Joins room `call:${callId}`; validates caller is caller or callee. Emits `call:joined`. | Reads `call_sessions`. |
| **`call:accept`** | `{ callId: string }` | Callee accepts incoming call. Updates `CallSession.status = 'ACTIVE'`, emits `call:accepted` to room. | Updates `call_sessions.status`, `accepted_at`. |
| **`call:reject`** | `{ callId: string, reason?: string }` | Callee declines incoming call. Updates `CallSession.status = 'REJECTED'`, emits `call:rejected` to room. | Updates `call_sessions.status`. |
| **`call:end`** | `{ callId: string }` | Terminates active call. Updates `CallSession.status = 'ENDED'`, calculates `durationSeconds`, emits `call:ended`. | Updates `call_sessions.status`, `ended_at`, `duration_seconds`. |
| **`call:signal`** | `{ callId: string, signal: object }` | Validates call is `ACTIVE`. Relays SDP Offer, SDP Answer, or ICE Candidate to peer in room `call:${callId}`. | None (High-throughput relay). |

---

## 3. Server-to-Client (S2C) Event Specifications

| Event Name | Target Room / Scope | Payload Schema | Client Action & UI Response |
| :--- | :--- | :--- | :--- |
| **`message:new`** | `chat:${chatId}` | `{ id, chatId, fromId, content, createdAt }` | Appends message bubble to chat window; plays subtle pop sound. |
| **`typing`** | `chat:${chatId}` | `{ chatId, socketId }` | Displays `<TypingIndicator>` dots above chat input. |
| **`stopTyping`** | `chat:${chatId}` | `{ chatId, socketId }` | Hides `<TypingIndicator>`. |
| **`call:incoming`** | `user:${calleeId}` | `{ call: { id, callerId, caller: { name, avatarUrl, collegeName }, mode: 'VOICE' \| 'VIDEO' } }` | Triggers full-screen incoming call modal with audio ringing tone. |
| **`call:accepted`** | `call:${callId}` | `{ call, byUserId }` | Stops ringing tone; transitions caller UI from "Calling..." to active WebRTC streaming. |
| **`call:rejected`** | `call:${callId}` | `{ call, byUserId, reason }` | Stops ringing tone; closes call overlay; shows toast: *"Call was declined."* |
| **`call:ended`** | `call:${callId}` | `{ call, byUserId }` | Releases camera/microphone hardware; closes overlay; renders call duration summary. |
| **`call:signal`** | `call:${callId}` | `{ callId, signal, fromUserId, mode }` | Client WebRTC engine consumes signal: `pc.setRemoteDescription()` or `pc.addIceCandidate()`. |
| **`notification:new`** | `user:${userId}` | `{ id, type, title, body, meta, createdAt }` | Increments notification bell unread counter badge; triggers slide-in toast. |
| **`broadcast:achievement`** | `college:${collegeId}` | `{ type, userId, name, message }` | Displays community spotlight banner on campus feed. |
| **`auth:banned`** | `user:${userId}` | `{ message: string }` | Forcibly clears local tokens; redirects to `/banned`; disconnects socket. |
| **`socket:error`** | `socket.id` (Unicast) | `{ message: string, statusCode: number }` | Client logs error or renders inline warning banner. |

---

## 4. Acceptance Criteria & Test Gates

1. Sockets lacking a valid JWT in handshake are disconnected with `Unauthorized` (`TEST-WS-001`).
2. Sockets can only join chats where they are verified participants (`TEST-WS-002`).
3. Signaling packets are relayed only when `CallSession.status === 'ACTIVE'` (`TEST-WS-003`).
