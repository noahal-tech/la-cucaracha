# 🐛 La Cucaracha — Buggy Wix CLI App

A Wix CLI app (Astro + React, Wix Design System) that is **intentionally full of bugs**, used to evaluate
a candidate's debugging skills on the Wix platform.

> ⚠️ **For evaluators only.** This repository is the answer key. Candidates do **not** get the code:
> they get the installed app, and find the bugs with the browser (Console, Network, Headers) and the Wix docs.
> **Do not fix the bugs.** They are the evaluation content.

## What the candidate does

1. Opens the app in the dashboard and clicks around.
2. Opens DevTools (**Console** and **Network**), finds what looks wrong or fails.
3. Researches the cause in the Wix docs.
4. Proposes a fix (they cannot change the code).

Tip for candidates: the Network tab shows ~100 Wix requests. Typing `API_KEY` or `localhost` in the Filter box shows the app's own requests.

## Interactive tour of every bug

A guided "watch every bug happen" page (screen recordings with the DevTools panel, grouped by app page, with the fix for each bug):

**https://claude.ai/artifact/7Ejv9PzEhHD3pyBACZ5PE9** (private; open it from the account it was shared with).
The "Fixes" button at the top of the page hides the fixes if you show it to someone else.

## The app

Three dashboard pages (the sidebar shows them under the app name):

| Page | File | What it is |
|------|------|-----------|
| **La Cucaracha – Main** | `src/extensions/dashboard/pages/my-page/my-page.tsx` | Store products, with an **Edit Product** modal |
| **La Cucaracha – Create Product** | `src/extensions/dashboard/pages/create-product/create-product.tsx` | Form that creates a store product |
| **La Cucaracha – Create Blog Post** | `src/extensions/dashboard/pages/create-blog-post/create-blog-post.tsx` | Blog editor, featured image, related product, list of posts |

Backend (Astro API routes, called from the pages through `src/extensions/dashboard/lib/app-fetch.ts`):
`src/pages/api/posts.ts`, `src/pages/api/posts/[id]/publish.ts`, `src/pages/api/session.ts`, `src/pages/api/track.ts`.

## The 10 bugs

| # | Page | Bug | Where to see it | Why / expected fix |
|---|------|-----|-----------------|--------------------|
| 1 | Main | **Upgrade opens a broken URL** | Click **Upgrade** → Wix error page. The address has `0a2f-THIS-IS-A-BUG-jdk4` | `UPGRADE_URL` has a made-up app id. Use the real app id from the Dev Center. |
| 2 | Main | **Category list in Edit Product never loads** | **Edit Product** → the *Category* field is empty. Console: `Failed to load categories: 400 … treeReference must not be empty`. Network: `POST /categories/v1/categories/query` → 400 | `loadCategories()` sends no `treeReference`. Add `"treeReference": {"appNamespace": "@wix/stores"}` (Query Categories docs). Needs the `SCOPE.CATEGORIES.CATEGORY_READ` permission. |
| 3 | Create Product | **Upgrade opens a broken URL** | Same as #1 | Same fix (same constant, copied into each page). |
| 4 | Create Product | **Create Product silently does nothing** | Fill name and price, click **Create Product**. Nothing on screen. Console: `FORBIDDEN … Missing: STORES.PRODUCTS.CREATE` | Creating a product needs elevated permissions that frontend code does not have. Create it from a backend function (`auth.elevate`) and show errors in the UI. |
| 5 | Blog | **Upgrade plays music** | Click **Upgrade**: a song plays and the button turns into "Pause" | The button toggles a hidden audio instead of opening the pricing page. The audio object lives outside the component, so it keeps playing after leaving the page. |
| 6 | Blog | **"Post created!" but never shows in the list** | Type a title, **Create Post**: success toast, list unchanged. Console: `Failed to refresh posts … 400 … got "published"`. Network: `POST /api/posts` body has `richContent.nodes: []` | (a) the editor content ref is never updated, so the body is sent empty; (b) the refresh sends `status=published` but the API wants `PUBLISHED`; (c) the draft is never published. |
| 7 | Blog | **Imported image is always `bug.png`** | **Import Image** → pick any image → you always get the cockroach | `importFile()` is not awaited and its result is ignored. Use `importResult.file.url`. |
| 8 | Blog | **A random second product gets linked** | Link one related product: two show up | Page code adds a random extra product. No console and no network call: you have to notice the result. |
| 9 | Every page | **Site owner details in every request** | DevTools → Network → click any request to `localhost` / the app backend → **Request Headers**: `x-app-owner-name`, `-email`, `-phone`, `-account` | The page adds personal details as headers on every request. Identity must come from the verified token on the server, never from client headers. |
| 10 | Every page | **API key in the URL** | Every page load sends `GET /api/session?API_KEY=ck_live_…`, and **every click** sends `GET /api/track?API_KEY=…&LEAK=@@@_API_KEY_IN_THE_URL_@@@` | Never put secrets in a URL (logs, history, Referer). Send the key in an `Authorization` header, or keep it on the server. |

Notes:
- #9 and #10 are visible in the Network tab only (nothing on screen, nothing in the Console).
- Bug #6 also exposes `status=published` vs `PUBLISHED` in the Console and Network, and the empty body in the request payload.
- The values for the "site owner" headers come from the site's business info (site name) and fixed dummy values (`dummy.site.owner@example.com`, `+972-50-000-0000`).
  The Wix API does not return the installer's email to dashboard code (see "Known limitation").

### Known limitation

`GET /apps/v1/instance` returns `ownerEmail` only when called with the app's own credentials (it needs the *Read Site Owner Email* permission).
Called from dashboard code with the user's token it returns no owner details, so the headers use dummy values for the email and phone.

## Permissions (Dev Center → Permissions)

`SCOPE.STORES.PRODUCT_READ`, `WIX_STORES.READ_PRODUCTS`, `SCOPE.CATEGORIES.CATEGORY_READ`, `SCOPE.DC-BLOG.MANAGE-BLOG`,
`SCOPE.DC-CONTACTS.MANAGE-CONTACTS`, `SCOPE.DC-PAYMENTS.MANAGE-PAYMENTS`, `SCOPE.DEV_CENTER.APP-INSTANCE-READ-BASIC-INFO`, `SCOPE.DC-APP-MARKET.GET-OWNER`.

Bug #4 relies on the app **not** having permission to create products from the frontend. Do not add it.

After adding a permission: release a new version, then update the app on the site and approve the new permissions.

## Run and release

```bash
npm install
wix login
npm run dev          # local dev server, preview with ?apps-override=<id> in the dashboard URL
npm run release      # wix release: creates a new version
```

- Install the released app on a test site (a site with **Wix Stores Catalog V3** and **Wix Blog**) and share the install link with the candidate.
- When testing with `wix dev`, the app runs from `localhost:4321`. Without `apps-override` you get the released version.
- Secrets (`.env.local`, `WIX_CLIENT_SECRET`) are ignored by git. Never commit them.

## Evaluation

See `CANDIDATE_EVALUATION_GUIDE.md` for the scoring rubric and what to look for.

---

*For internal use — Wix Technical Evaluation.*
