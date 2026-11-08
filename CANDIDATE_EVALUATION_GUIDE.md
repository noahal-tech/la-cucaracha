# 📋 Candidate Evaluation Guide — La Cucaracha

For evaluators. The full list of bugs, where to see each one and the expected fix is in `README.md`
(and in the interactive tour linked there). This guide is about **how to run the session and score it**.

## Setup

- The candidate gets the **installed app** on a test site (Wix Stores Catalog V3 + Wix Blog). **No source code.**
- They use Chrome DevTools (Console, Network, Headers) and the Wix docs (dev.wix.com).
- Suggested time: **60 minutes**. Junior candidates may need hints after 30 minutes.
- Ask them to think out loud: where they look, what they expect, what they found.

## What you are looking for

1. **Finding**: do they use the right tool for the right symptom?
   - Visible on screen: Upgrade buttons, empty Category list, `bug.png`, the extra random product, a toast that lies.
   - In the Console: the Category 400, `FORBIDDEN` on create product, the failed refresh after "Post created!".
   - Only in the Network tab: owner details in headers, the API key in the URL.
2. **Understanding**: can they tell a **client** problem from a **backend** or **permission** problem?
3. **Research**: do they find the right docs page and read the request/response, not just guess?
4. **Fix**: do they propose a fix that matches the docs (not a workaround that hides the symptom)?

## Scoring (100 points)

| # | Bug | Find | Cause | Fix | Total |
|---|-----|:---:|:---:|:---:|:---:|
| 1 | Main: Upgrade opens a broken URL | 3 | 3 | 4 | **10** |
| 2 | Main: Category list never loads (`treeReference`) | 4 | 4 | 4 | **12** |
| 3 | Create Product: Upgrade opens a broken URL | 2 | 2 | 2 | **6** |
| 4 | Create Product silently does nothing (`FORBIDDEN`) | 4 | 4 | 4 | **12** |
| 5 | Blog: Upgrade plays music | 3 | 3 | 4 | **10** |
| 6 | Blog: "Post created!" but not in the list | 4 | 5 | 5 | **14** |
| 7 | Blog: Imported image is always `bug.png` | 3 | 3 | 4 | **10** |
| 8 | Blog: a random second product gets linked | 3 | 3 | 3 | **9** |
| 9 | Site owner details in every request | 2 | 2 | 3 | **7** |
| 10 | API key in the URL | 2 | 2 | 3 | **7** |
| | **Total** | | | | **97** |
| | Bonus: clear notes, good questions, spots the pattern of copied code (the same Upgrade URL in 3 pages) | | | | **+3** |

Hard bugs (more points): #2 (docs-only, no hint in the UI), #4 (permissions + backend), #6 (three separate causes).
Easy bugs: #1, #3 (but see if they notice it is the same bug on every page).

## Hints you can give (in this order)

- "Open the Network tab and filter by `localhost` or `API_KEY`."
- "Click the request, then look at the **Headers** and the **Response** tabs."
- "What does the docs example send that this request does not?"
- "Which part of this app runs in the browser, and which part could run with more permissions?"

## Score guide

| Score | Level |
|-------|-------|
| 85+ | Strong: finds most bugs, explains root causes, proposes docs-based fixes |
| 65–84 | Good: finds the visible and Console bugs, needs a hint for the Network-only ones |
| 40–64 | Needs support: finds the obvious bugs, guesses at causes |
| < 40 | Not yet: relies on hints for most bugs |

## Red flags

- Cannot tell client code from backend code.
- Proposes to "hide the error" or remove the failing request instead of fixing the cause.
- Does not read the response body or the docs.
- Does not notice that secrets or personal data are sent in every request.

## Important

- Do **not** share this repository or the README with the candidate: they list every bug and fix.
- Bugs are intentional. Do not fix them.
