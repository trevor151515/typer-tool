# Nailing down the workflow

Audit of what the README covers today, for gap-finding. Summaries only — not the full wording.

---

## 10-minute quickstart (what it covers)

**Assumed before step 1:** User already has the Typer Tool project folder on their computer (project root with `README.md`, `devserver.py`, etc.). **Not stated in the README.**

1. **Install Python (one-time, if needed)**
   - Download Python 3 from python.org
   - Windows: Add to PATH + Install Now
   - Mac: run macOS installer (no PATH checkbox)
   - How to open a terminal in project root (Windows + Mac)
   - Verify with `python --version` and `pip --version`

2. **Start the local site**
   - `pip install -r requirements-dev.txt`
   - `python devserver.py`
   - Brief explanation of what those commands do
   - Open `http://localhost:8000/` in browser

3. **Create Firebase project + web app**
   - Firebase Console → create project
   - Project settings → General → add Web app
   - Copy config into `src/scripts/firebaseConfig.js` (no detailed sub-steps)

4. **Enable auth**
   - Authentication → Get started
   - Enable Google + Email/Password
   - Authorized domains → add `localhost`

5. **Enable Firestore**
   - Create Firestore database (Standard, Production mode)
   - Rules tab → paste from `firebase/firestore.rules` → Publish

6. **Allow your email**
   - Open `src/scripts/authorization.js`
   - Replace sample emails in `allowedEmails`

7. **Test**
   - `http://localhost:8000/` → sign in → create doc → type
   - Confirm data in Firestore at `typerDrafts/{uid}/files/{docId}`

**Pointer:** If stuck, use full step-by-step below.

**Not in quickstart:** GitHub, GitHub Pages, deploy URL, desk usage guide, troubleshooting, checklist, security notes, support section.

---

## Step-by-step guide (what it covers)

### Front matter (before numbered sections)

- What the product is (bullet list + paragraph)
- “Follow top-to-bottom” guidance
- Screenshots
- **What you are building** — 3-sentence overview (sign-in → allowlist → auto-save)

### 1) Files you should have

- List of expected files/folders in project root
- Warning not to rename folders without updating code

### 2) Optional: server starts check (before Firebase)

- **Open a terminal** (Windows / Mac) — project root
- **Install Python** (if needed) — download, PATH (Windows), Mac installer, verify versions
- **What to do** — pip install, run devserver, open localhost:8000
- **What you should see** — redirect to `/auth/`, Typer auth page, maybe Firebase-not-configured message
- **Troubleshooting** — python/pip not recognized, wrong folder, port 8000 busy, Mac `python3` note

### 3) Firebase setup (required)

**3.1 Create Firebase project and web app**

1. Open Firebase Console
2. Create project + name
3. Project settings (gear)
4. General → Your apps → Web app
5. Register app (nickname)
6. Copy config block (lists all 6 fields with labels)
7. Open `firebaseConfig.js` in Typer Tool project folder
8. Indentation warning before editing
9. Paste real values over placeholders (lists 6 fields again)
- Important: frontend-safe keys; must replace all `PASTE_*`

**3.2 Enable Authentication**

- Security → Authentication → Get started
- Enable Google + Email/Password
- Google: support email
- Email/Password: enable provider
- Apple Sign In note (optional context)
- Authorized domains: `localhost` + production domain example

**3.3 Create Firestore**

- Create database (Standard, production mode, defaults)
- Rules: copy `firebase/firestore.rules`, paste in console, Publish
- Rules behavior explained (path + uid scoping)

### 4) Configure allowlist

- Open `authorization.js`
- Replace `allowedEmails` (example snippet)
- Remove dummy emails; allowlist vs Firestore security note

### 5) Firestore data setup

- No manual collection creation needed
- App auto-creates path on New → title → save/autosave
- Document shape (`content`, `updatedAt`)
- How to verify in Firestore Data tab
- If no data: rules not published or email not allowlisted

### 6) Run locally + real test

- Run `devserver.py` again (assumes deps already installed)
- localhost → sign in (allowlisted) → New → title → type → Save
- Confirm in Firestore Data tab

### How to use the Typer desk (post-setup usage, not install)

- First document requires New → title → confirm (typing alone doesn’t create file)
- Save / autosave / Open
- Read, Focus, Pomodoro
- No in-app delete — how to delete in Firebase Console

### 7) Put this on GitHub

- **Option A:** Create repo → upload files via browser → commit
- **Option B:** git init / add / commit / push (with command explanations)

### 8) Deploy with GitHub Pages

- Prerequisites (files on GitHub, public repo, `/src` folder)
- Settings → Pages → branch `main`, folder `/src`
- Wait for URL format
- **Firebase:** add Pages domain to authorized domains
- **Final deploy check** on live URL
- If site doesn’t appear (branch/folder/wait/Actions)

### 9) Final checklist

- Checkbox list (config, allowlist, auth methods, allowlist block, New/Open/Save, Firestore path)

### 10) Troubleshooting

- Firebase not configured
- permission-denied
- auth/unauthorized-domain
- Sign-in popup blocked
- Sign in but can’t enter desk

### 11) Security reminders

- Allowlist ≠ full security; keep rules strict; test blocked user

### Support Development

- Donation / PayPal.me link

---

## Gaps (missing, unclear, or only in one path)

_Start here and keep adding as we review._

### Getting the project at all

- [ ] **No step to get the repo onto the user’s machine** (download ZIP from GitHub, clone, unzip, where to put the folder, what the folder should be named)
- [ ] No “you need a GitHub account” / “you need a Google account for Firebase” called out up front as prerequisites
- [ ] Section 1 lists files but doesn’t help someone who only has a partial download or wrong folder structure

### Editing config without an IDE

- [ ] No guidance for editing `.js` files (Notepad, TextEdit plain text, GitHub web editor, VS Code optional)
- [ ] Mac TextEdit rich-text trap not mentioned
- [ ] No “save the file after editing” before retesting
- [ ] Quickstart step 3/6 point at files but don’t say how to open them on disk

### Quickstart vs full guide mismatches

- [ ] Quickstart Firebase config is one line; full 3.1 has 9 sub-steps (indentation, field list, project folder path)
- [ ] Quickstart Firestore rules: “paste `firebase/firestore.rules`” — doesn’t say open that file locally and copy, or where in Firebase Console to paste
- [ ] Quickstart auth: no Google “support email” sub-step (full 3.2 has it)
- [ ] Quickstart test: doesn’t spell out **New → title → confirm** before typing (full sections 5–6 do)
- [ ] Quickstart doesn’t say leave `devserver.py` running (or restart it after config edits)

### Local dev / environment

- [ ] No note that `pip install` is once per machine (or per project), not every time
- [ ] No “how to stop the server” (Ctrl+C) before changing ports or restarting
- [ ] `firebase/firestore.indexes.json` listed in section 1 — never used in any step
- [ ] Email/password: enable provider vs actually **registering** a new account vs signing in with existing

### Paths and order of operations

- [ ] README order: local setup (2–6) → GitHub (7) → Pages (8). Vanilla user who starts on GitHub upload may never do local Python — no single “choose your path” (local-first vs GitHub-first)
- [ ] GitHub Pages authorized domain only in section 8; quickstart only adds `localhost` — deploy will break sign-in until 8.3
- [ ] Editing on GitHub after upload: re-deploy wait, commit flow not tied back to Firebase config steps

### Firebase / browser UX

- [ ] Popup blockers for Google sign-in (only in troubleshooting, not during setup)
- [ ] `auth/unauthorized-domain` — user may hit on live URL before reading section 8
- [ ] No screenshot or “what Firebase Console looks like” for overwhelmed users
- [ ] Firestore rules: risk of pasting wrong file or partial paste — no “compare to published” check

### Testing and validation

- [ ] No second-account test called out in quickstart (only checklist + security section)
- [ ] Checklist is section 9 — many users won’t reach it if they stop after quickstart “Test”

### Other

- [ ] No minimum browser recommendation
- [ ] Private vs public GitHub repo implications for Pages (mentioned briefly in 8, not in 7)
- [ ] If user edits config only on GitHub web UI, section 2 (local terminal) may be skippable — not documented as intentional path

---

## Notes for next pass

- Decide **default persona**: local-first (Python) vs GitHub-only (no Python).
- Map each gap to: quickstart only / step-by-step only / both / new prerequisite section.
- Do not update README until gap list feels complete.
