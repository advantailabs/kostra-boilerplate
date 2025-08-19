# Security Review: API Routes (Authentication, Authorization, IDOR Risks)

## Scope and Approach

I reviewed all API routes, their service layers, and repositories, focusing on:

- Authentication
- Authorization (ownership enforcement)
- IDOR (Insecure Direct Object Reference) risks

The review covered **threads, personas, knowledge bases (KBs), files, and file-KB relationships**.  
Below is a breakdown of what’s already safe, what’s vulnerable, and the prioritized task list to fix gaps.

---

## ✅ What’s Already Protected Correctly

### Threads

- `GET /api/threads`, `POST /api/threads/stream`, `POST /api/threads/[id]/messages/stream`  
  → Authenticated, ownership check via `findByUserAndId`.
- `GET /api/threads/[id]`, `DELETE /api/threads/[id]`  
  → Authenticated, ownership enforced via `getThreadWithMessages(userId, threadId)` and `deleteThreadService(userId, threadId)`.

### Personas

- `GET/PUT/DELETE /api/personas/[id]`  
  → Authenticated, ownership enforced (`getPersonaByIdService`, `findPersonaByUserAndId`).
- `GET/POST /api/personas`  
  → Authenticated, creation scoped to current user.

### Files

- `GET/PUT/DELETE /api/files/[id]`  
  → Authenticated, ownership enforced.
- `GET /api/files`  
  → Authenticated, repository filters by `userId`.

### Smart Search

- `POST /api/search/smart`  
  → Authenticated, validates KB ownership before accessing vector store.

### Users / Credits / Billing

- All credits, history, checkout, and portal routes  
  → Authenticated and scoped to current user.

---

## ❌ Vulnerabilities and Risks to Fix

### Knowledge Base IDOR (Update/Delete)

- **Problem:** `PUT /api/knowledge-bases/[id]` and `DELETE /api/knowledge-bases/[id]` authenticate but **do not verify ownership**.
- **Impact:** User can update/delete another user’s KB (including deleting files).

### Knowledge Base Files IDOR + Info Disclosure

- **Problem:**
  - `GET /api/knowledge-bases/[id]/files`: no ownership check.
  - `POST/DELETE /api/knowledge-bases/[id]/files`: no ownership checks on KB or File.
- **Impact:** Data disclosure and poisoning of vector stores across tenants.

### File Upload → KB Link IDOR

- **Problem:** `POST /api/files` accepts `knowledgeBaseIds` without ownership check.
- **Impact:** User can attach files into someone else’s KB.

### Presigned Upload URL Authorization Missing

- **Problem:** `POST /api/file-upload/presigned-url` does not check `objectId` ownership.
- **Impact:** Users can mint presigned URLs for foreign resources (e.g., overwrite another user’s persona logo).

### Repository Methods Update by ID Only

- **Problem:** `updateKnowledgeBase(id, ...)`, `deleteKnowledgeBase(id, ...)` don’t scope by `userId`.
- **Impact:** Relies on route enforcement; risky if route forgets ownership check.

### Middleware Configuration Footgun

- **Problem:** `src/middleware.ts` marks many API groups as `PUBLIC_ROUTES` (even with comments requiring auth).
- **Impact:** Increases chance of forgetting to enforce auth.

---

## 🛠️ Task List (Prioritized)

### 1. Enforce Ownership on KB Update/Delete (**Critical**)

- **Files:**
  - `src/app/api/knowledge-bases/[id]/route.ts`
  - `src/services/internal/knowledge-base.ts`
  - `src/services/repositories/knowledge-base/index.ts`
- **Actions:**
  - Check `kb.userId === user.id` before update/delete.
  - Prefer repository methods `where: { id, userId }`.
- **Acceptance:** Foreign KB update/delete → **404/403**.

---

### 2. Enforce Ownership on KB Files Endpoints (**Critical**)

- **Files:**
  - `src/app/api/knowledge-bases/[id]/files/route.ts`
  - `src/services/internal/knowledge-base.ts`
  - `src/services/internal/file.ts`
- **Actions:**
  - `GET`: verify KB belongs to current user.
  - `POST/DELETE`: verify both KB and File belong to user.
- **Acceptance:** Cross-tenant linking/unlinking → **404/403**.

---

### 3. Enforce KB Ownership When Linking During File Uploads (**Critical**)

- **Files:**
  - `src/app/api/files/route.ts`
  - `src/services/internal/file.ts`
- **Actions:**
  - Validate each `knowledgeBaseId` belongs to current user before linking.
- **Acceptance:** Upload with foreign KB → **404/403**.

---

### 4. Authorize Presigned Upload URLs (**High**)

- **File:** `src/app/api/file-upload/presigned-url/route.ts`
- **Actions:**
  - Enforce ownership checks per `uploadPurpose`.
- **Acceptance:** Presign misuse with foreign objectId → **403/404**.

---

### 5. Scope Repository Updates/Deletes by User (**Defense-in-depth**)

- **File:** `src/services/repositories/knowledge-base/index.ts`
- **Action:** Pass `userId` into repo methods.
- **Acceptance:** Cross-tenant update/delete fails even if route check missed.

---

### 6. Fix KB Files List Info Disclosure (**High**)

- **File:** `src/app/api/knowledge-bases/[id]/files/route.ts`
- **Action:** Check KB ownership before listing.
- **Acceptance:** Listing files of foreign KB → **404/403**.

---

### 7. Standardize 404 vs 403 (**Medium**)

- **Action:** Use **404** for foreign resource IDs (avoid existence leaks), **403** for known-but-forbidden.
- **Acceptance:** Consistent error semantics across APIs.

---

### 8. Middleware Hardening (**Medium**)

- **File:** `src/middleware.ts`
- **Action:** Remove sensitive API groups from `PUBLIC_ROUTES`; let middleware enforce auth by default.
- **Acceptance:** All API routes auto-authenticated.

---

### 9. CORS Tightening for SSE Endpoints (**Low**)

- **Files:**
  - `src/app/api/threads/stream/route.ts`
  - `src/app/api/threads/[id]/messages/stream/route.ts`
- **Action:** Restrict `Access-Control-Allow-Origin` to app origin only.

---

### 10. Test Suite Additions (**High**)

- **Files:** `src/services/internal/**tests**/` + API integration tests
- **Actions:** Add IDOR coverage for:
  - KB update/delete by foreign user
  - KB files list/add/remove by foreign user
  - File upload to foreign KB
  - Presigned URL misuse
- **Acceptance:** Tests fail before fixes, pass after.

---

### 11. Optional: Rate Limiting (Nice-to-have)

- Add token-bucket style limits on sensitive endpoints.

---

## 📂 File-by-File Pointers

- `src/app/api/knowledge-bases/[id]/route.ts`: ownership checks on PUT/DELETE.
- `src/services/internal/knowledge-base.ts`: accept `currentUserId` and validate ownership.
- `src/services/repositories/knowledge-base/index.ts`: scope update/delete by `{ id, userId }`.
- `src/app/api/knowledge-bases/[id]/files/route.ts`: enforce ownership on GET/POST/DELETE.
- `src/services/internal/file.ts`: enforce file + KB owner match.
- `src/app/api/files/route.ts`: validate KB IDs belong to current user.
- `src/app/api/file-upload/presigned-url/route.ts`: implement per-purpose ownership validation.
- `src/middleware.ts`: remove risky `PUBLIC_ROUTES`.

---

## ✅ Acceptance Criteria Checklist

- [ ] User cannot update/delete KBs they don’t own.
- [ ] User cannot list/add/remove files in foreign KBs.
- [ ] User cannot link uploads to foreign KBs.
- [ ] User cannot presign foreign resources.
- [ ] Repo methods enforce user scoping.
- [ ] New tests verify all above cases.
