# Postaway Frontend Plan

Vanilla HTML + Tailwind CSS + vanilla JS, served from `src/public/` (already wired in `server.js`). No backend changes unless you later add SPA routing or Tailwind build steps.

---

## 1. Goals

Build a social feed app that covers:

| Area | APIs |
|------|------|
| Auth | signup, signin, logout, email verify, OTP reset |
| Profile | get/update user details |
| Feed | list posts, create/edit/delete posts |
| Engagement | comments, likes |
| Social | friends, pending requests, accept/reject |

---

## 2. Architecture

**Multi-page app (MPA)** — one HTML file per major view, shared JS modules. Fits Express static serving and keeps scope small.

```
src/public/
├── index.html              → Landing / redirect
├── auth/
│   ├── login.html
│   ├── signup.html
│   ├── verify-email.html   → ?token= from email link
│   └── reset-password.html → OTP flow (3 steps)
├── app/
│   ├── feed.html           → Main feed
│   ├── profile.html        → Own profile + edit
│   ├── user.html           → Other user profile + posts
│   ├── post.html           → Single post + comments
│   └── friends.html        → Friends + pending requests
├── css/
│   └── styles.css          → Tailwind output (or CDN for dev)
├── js/
│   ├── api.js              → Fetch wrapper + auth headers
│   ├── auth.js             → Token/cookie/session helpers
│   ├── router.js           → Guard pages, redirect if unauthenticated
│   ├── ui.js               → Toasts, modals, loading states
│   ├── feed.js
│   ├── posts.js
│   ├── comments.js
│   ├── likes.js
│   ├── friends.js
│   └── profile.js
└── components/
    ├── navbar.html
    └── post-card.html
```

**Tailwind setup:** CDN in each HTML `<head>` for dev (no build step). Optional production path: CLI build → `css/styles.css`.

---

## 3. Auth & API Client

### Token strategy

Sign-in returns JWT in body **and** sets `httpOnly` cookie `jwtToken`. For same-origin requests (`localhost:3000`), rely on cookies with `credentials: 'include'`. Also store JWT from sign-in response in `sessionStorage` as fallback for `Authorization: Bearer <token>`.

### Auth flows

| Flow | Pages | API sequence |
|------|-------|--------------|
| Sign up | `signup.html` | `POST /api/users/signup` → “Check email” |
| Verify email | `verify-email.html?token=` | `GET /api/users/verify-email?token=` |
| Login | `login.html` | `POST /api/users/signin` → redirect to feed |
| Logout | navbar | `POST /api/users/logout` |
| Forgot password | `reset-password.html` | `POST /api/otp/send` → verify → `POST /api/otp/reset-password` |

**Page guard:** `router.js` checks session on `/app/*`; unauthenticated users go to login.

---

## 4. Pages & UI

### Global layout (navbar on all `/app/*` pages)

- Logo → feed
- “New post” button
- Friends (badge for pending count)
- Profile avatar → profile
- Logout

### Auth pages

- **Signup:** name, email, password, gender
- **Login:** email, password
- **Reset password:** 3-step OTP wizard

### Feed (`app/feed.html`)

- Load: `GET /api/posts/all`
- Post cards with like, comment, edit/delete (owner only)
- Create post modal: caption + file or URL → `POST /api/posts/`

### Post detail (`app/post.html`)

- Load post, comments, likes
- CRUD comments, toggle likes

### Profile (`app/profile.html`)

- View/edit own profile via `GET/PUT /api/users/...`
- User posts filtered client-side from feed (workaround for route order bug)

### Friends (`app/friends.html`)

- Friends list and pending requests with accept/reject

---

## 5. Tailwind Design System

- Primary: `indigo-600`
- Surface: `gray-50` background, `white` cards
- Cards: `rounded-xl shadow-sm border border-gray-100 p-4`
- Feed container: `max-w-2xl mx-auto`

---

## 6. Backend Quirks to Plan Around

1. **Route order bug:** `GET /api/posts/user/:userId` may be shadowed by `GET /api/posts/:postId`. Workaround: filter from `GET /api/posts/all` client-side.
2. **Likes require `?type=Post|Comment`** on every like call.
3. **Post create/update** uses `multipart/form-data` with field name `imageUrl`.
4. **Sign-in blocked** until `isVerified === true`.
5. **Image URLs** may be relative (`./uploads/...`) — normalize to `/uploads/...`.

---

## 7. Implementation Order

| Phase | Deliverable |
|-------|-------------|
| 1. Foundation | Tailwind, `api.js`, `auth.js`, `router.js`, navbar |
| 2. Auth | Login, signup, verify-email, session guard |
| 3. Feed | List posts, post cards, create post modal |
| 4. Engagement | Likes, post detail, comments CRUD |
| 5. Profile | View/edit profile, user posts grid |
| 6. Social | Friends list, requests, toggle friendship |
| 7. Password reset | OTP wizard |
| 8. Polish | Loading/error/empty states, mobile nav |
