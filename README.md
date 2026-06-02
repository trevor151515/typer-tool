# Typer Tool setup

This project gives you a private writing environment with:
- sign-in (Google + Email/Password)
- saved drafts in Firestore
- a simple allowlist so only specific emails can enter

Typer Tool gives you a minimalist, distraction-free environment that you can access from any device with an internet connection: a smartphone, tablet, laptop, desktop, or a work terminal that has a browser.

If you are not a tech user, skip the 10-minute quickstart and follow the step-by-step procedure below.

**How this setup works:** You will fork Typer Tool into your own GitHub account, configure Firebase in your browser, edit two small config files **on GitHub** (no IDE and no downloads required), turn on GitHub Pages for a live website URL, and test Typer in your browser. Everything happens in GitHub and Firebase — not on your computer’s file system.

<br>
<br>

<p align="center">
  <img src="assets/mobile%20focus.png" alt="Typer on mobile — focus mode" width="45%" />
  &nbsp;&nbsp;&nbsp;
  <img src="assets/mobile%20menu.png" alt="Typer on mobile — menu" width="45%" />
</p>
<p align="center">
  <img src="assets/pc%20focus.png" alt="Typer on desktop — focus mode" width="85%" />
</p>

## What you are building

You are creating a website page where:
1. A user signs in.
2. Allowed users can open the writing desk.
3. The app auto-saves writing to that user's Firestore path.

Your live site will be hosted at a URL like:

`https://<your-github-username>.github.io/typer-tool/`

---

## 10-minute quickstart (summarized)

If you are a tech user and familiar with GitHub and Firebase, follow these steps:

1. **GitHub:** Create an account → open `https://github.com/<author-user>/typer-tool` → **Fork** → **Create fork**.
2. **Firebase:** Create project → add Web app → copy all 6 config values → enable **Google** + **Email/Password** auth → add authorized domain **`yourusername.github.io`** → create Firestore (Standard, production mode) → paste rules from `firebase/firestore.rules` on your fork → **Publish**.
3. **Configure fork (on GitHub):** Edit `src/scripts/firebaseConfig.js` → paste Firebase values → **Commit changes**. Edit `src/scripts/authorization.js` → your email(s) → **Commit changes**.
4. **GitHub Pages:** Repo **Settings → Pages →** branch `main`, folder **`/src`** → **Save** → wait 1–5 minutes for deploy URL.
5. **Test:** Open your live URL → sign in → **New** → title → type → **Save** → confirm doc in Firestore **Data** tab at `typerDrafts/{uid}/files/{docId}`.

If you get stuck, use the full step-by-step guide below.

---

## Step-by-step guide to setting up your Typer Tool

## 1) Create your GitHub account and fork Typer Tool

You will work from **your own fork** of the starter repo. That way your Firebase settings, allowlist, and live website all belong to your GitHub account.

1. If you do not have a GitHub account yet, go to [GitHub](https://github.com/) and sign up, then return here.
2. Open the Typer Tool starter repository (the link you were given): `https://github.com/<author-user>/typer-tool`
3. Click **Fork** (top right) → **Create fork**.
4. When GitHub finishes, you should be on `https://github.com/<your-github-username>/typer-tool` — that is **your fork**. Bookmark this page; you will edit files here and turn on your live site from here.

You do **not** need to download the project to your computer for this guide.

---

## 2) Firebase setup (required)

Do this in [Firebase Console](https://console.firebase.google.com/). You can use the same Google account you used for GitHub, or a different one.

### 2.1 Create a Firebase project and web app

1. Open [Firebase Console](https://console.firebase.google.com/).
2. Click **Create a project**.
3. Enter a project name and continue through the prompts.
4. After project creation, click the **gear icon** (Project settings).
5. In **General → Your apps**, click the **Web icon** (`</>`) to create a Web app.
6. Register the app (nickname can be anything, example: `typer-web`).
7. Firebase shows your web app config. Copy this entire block and keep it somewhere handy (you will paste it in step 3). You need all six:
   - `apiKey: <Firebase value>`
   - `authDomain: <Firebase value>`
   - `projectId: <Firebase value>`
   - `storageBucket: <Firebase value>`
   - `messagingSenderId: <Firebase value>`
   - `appId: <Firebase value>`

Important:
- These values are safe to put in frontend code.
- If you leave even one `PASTE_*` placeholder in the project, the app will show "Firebase not configured."

### 2.2 Enable Authentication providers

In Firebase Console:
1. Go to **Security → Authentication**.
2. Click **Get started**.
3. Open the **Sign-in method** tab.
4. Enable:
   - **Google**
   - **Email/Password**

Google:
- Enable the provider.
- Choose a support email.

Email/Password:
- Enable the Email/Password provider.

Apple note:
- Official Apple Sign In usually requires an Apple Developer account (about `$100/year`).
- To avoid that, users can still use Apple-hosted email addresses with Email/Password sign-in.

Authorized domains:
1. In Authentication, open the **Settings** tab.
2. Under **Authorized domains**, add:
   - **`your-github-username.github.io`** (use your real GitHub username — this matches your GitHub Pages site)
   - Example: if your username is `janedoe`, add `janedoe.github.io`

You do **not** need `localhost` for this guide unless you later add optional local preview on your computer.

### 2.3 Create Firestore database and rules

In Firebase Console:
1. Go to **Databases & Storage → Firestore**.
2. Click **Create database**.
3. Choose **Standard** edition.
4. For Database ID and location, use the default populated values unless you have a specific reason to change them.
5. Choose **Start in production mode**.
6. Click **Create** / **Enable**.

Now set rules:
1. On **your fork** on GitHub, open `firebase/firestore.rules` (browse the file — do not download the repo).
2. Click the file name to view it, then click the **raw** button or select all text and copy the full rules contents.
3. In Firebase Console, open Firestore **Rules** tab.
4. Paste the copied rules into the editor (replace what is there).
5. Click **Publish**.

Rules behavior:
- Drafts are saved under `typerDrafts/{uid}/files/{docId}`.
- Only the signed-in user with that `uid` can read/write that path.

---

## 3) Configure your fork on GitHub (no IDE required)

All file edits in this section happen **on github.com** in your fork. You never need to install an editor on your computer.

### How to edit a file on GitHub

1. On your fork (`https://github.com/<your-github-username>/typer-tool`), browse to the file (example: `src/scripts/firebaseConfig.js`).
2. Click the **pencil (Edit)** icon near the top right of the file view.
3. Make your changes in the browser editor.
4. Scroll down, enter a short commit message (example: `Add Firebase config`).
5. Click **Commit changes**.

Your changes are saved to **your fork on GitHub** immediately. No terminal, no git install, and no “push” step from your laptop.

After you turn on GitHub Pages (section 4), each commit also triggers a new deploy of your live site (usually within a few minutes).

### 3.1 Paste your Firebase config

1. On your fork, open `src/scripts/firebaseConfig.js`.
2. Click the **pencil (Edit)** icon.
   - Before you edit: keep the same indentation as the original file — each line should stay lined up inside the `{ ... }` block. Only change the values inside the quotes.
3. Replace the placeholder block with the real values you copied from Firebase in section 2.1, step 7:
   - `apiKey: <your Firebase value>`
   - `authDomain: <your Firebase value>`
   - `projectId: <your Firebase value>`
   - `storageBucket: <your Firebase value>`
   - `messagingSenderId: <your Firebase value>`
   - `appId: <your Firebase value>`
4. Scroll down → commit message (example: `Configure Firebase`) → **Commit changes**.

### 3.2 Set your allowed email addresses

1. On your fork, open `src/scripts/authorization.js`.
2. Click the **pencil (Edit)** icon.
3. Replace the sample emails in `allowedEmails` with real email addresses you want to allow:

```js
export const allowedEmails = [
  "you@example.com",
  "collaborator@example.com"
];
```

4. Remove all dummy/sample emails. Keep only real accounts you want to allow.
5. Scroll down → commit message (example: `Set allowlist`) → **Commit changes**.

Important:
- This allowlist is website-level UX gating.
- Firestore rules are still the actual security layer.

---

## 4) Turn on GitHub Pages (your live website)

This publishes your fork as a real website you can open on any device.

### Before you start

- Your fork should already include the Firebase and allowlist commits from section 3.
- Use a **Public** fork/repo for the simplest GitHub Pages path.
- This project publishes from the **`/src`** folder (that is expected).

### Step-by-step

1. Open **your fork** on GitHub (`https://github.com/<your-github-username>/typer-tool`).
2. Click the **Settings** tab (top of the repo page).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment**:
   - **Source**: choose **Deploy from a branch**
   - **Branch**: choose `main`
   - **Folder**: choose **`/src`**
5. Click **Save**.

### What happens next

- GitHub starts building your Pages site.
- Wait **1–5 minutes** (sometimes longer on the first deploy).
- Refresh the Pages settings screen until you see a live URL.
- Your site URL will look like:
  - `https://<your-github-username>.github.io/typer-tool/`

### Confirm Firebase authorized domain

If you have not already (section 2.2), open Firebase Console → **Authentication → Settings → Authorized domains** and confirm **`your-github-username.github.io`** is listed. Sign-in will fail on your live site if this domain is missing.

---

## 5) Firestore data setup (what users often miss)

You do **not** need to manually create Firestore collections or documents first.

The app creates them automatically the first time a signed-in allowlisted user:
1. opens your live Typer site
2. clicks **New**
3. enters a document title
4. saves or autosaves

At that point, Firestore will automatically get:

```
typerDrafts/{uid}/files/{docId}
```

with fields:
- `content` (string)
- `updatedAt` (server timestamp)

---

## 6) Test your live site

Now that sections 2, 3, and 4 are complete:

1. Open your **live GitHub Pages URL** (not localhost):
   - `https://<your-github-username>.github.io/typer-tool/`
2. If you just committed changes, wait a few minutes and hard-refresh the page.
3. Sign in with an **allowlisted** account (an email you put in `authorization.js`).
4. Click **New**, enter a title, and confirm.
5. Start typing in the new document.
6. Click **Save** once.
7. In Firebase Console → Firestore **Data** tab, confirm the document appears under `typerDrafts/{uid}/files/{docId}`.

If all of these steps work, your setup is complete.

If you do not see data in Firestore:
- Firestore rules may not have been published — re-paste `firebase/firestore.rules` and publish again.
- The signed-in email may not be in `allowedEmails` on your fork (check `authorization.js` and commit again if needed).

---

## How to use the Typer desk

This section explains the normal day-to-day workflow once setup is complete.

### 1) Start your first document (required)

When you first enter the desk, typing by itself does not create a file yet.

You must:
1. Click **New**
2. Enter a title
3. Confirm
4. You will then see that title appear above the keyboard/typing area.
5. Start writing in your new document.

After this, the app creates your Firestore document and your writing can be saved.

### 2) Saving behavior

- **Manual save:** click **Save** anytime.
- **Auto save:** runs periodically while you work (about every 60 seconds).
- **Open existing docs:** click **Open** and choose a title from your list.

### 3) Read mode and writing tools

- **Read:** opens a clean reading view of the current document.
- **Focus:** dims the interface and enters fullscreen for distraction-free writing.
- **Pomodoro:** available from the toolbar.

### 4) Deleting documents (intentional design)

There is no delete button inside the Typer desk UI by design.

This is intentional so users cannot accidentally remove writing with one click.
Deleting requires deliberate steps in Firebase:

1. Open Firebase Console.
2. Go to **Firestore Database**.
3. Open **Data** tab.
4. Open `typerDrafts`.
5. Open your user document (UID-looking name).
6. Open `files`.
7. Find the document you want to remove.
8. Click the **three dots** menu for that document.
9. Click **Delete** and confirm.

If you are unsure, back up/copy the text before deleting.

---

## 7) Making changes later

To update Firebase config, allowlist, or any project file after you are live:

1. Open the file on **your fork** on GitHub.
2. Click **Edit** → make changes → **Commit changes**.
3. Wait a few minutes for GitHub Pages to redeploy.
4. Hard-refresh your live site and test again.

You still do not need to download anything to your computer for normal updates.

---

## 8) Final checklist

- [ ] You forked Typer Tool to your own GitHub account
- [ ] `src/scripts/firebaseConfig.js` on your fork has no `PASTE_*` values
- [ ] `allowedEmails` in `authorization.js` has real emails only
- [ ] GitHub Pages is enabled (`main` branch, **`/src`** folder)
- [ ] `your-github-username.github.io` is in Firebase **Authorized domains**
- [ ] Firestore rules from `firebase/firestore.rules` are published
- [ ] Google sign-in works on your live URL
- [ ] Email/password registration works
- [ ] Email/password sign-in works
- [ ] Non-allowlisted users are blocked
- [ ] Allowlisted users can open the desk
- [ ] New/Open/Save works on your live URL
- [ ] Firestore shows docs at `typerDrafts/{uid}/files/{docId}`

---

## 9) Troubleshooting

### "Firebase not configured"
- One or more `PASTE_*` values still exist in `firebaseConfig.js` on your fork.
- Edit the file on GitHub, commit, wait for Pages to redeploy, and hard-refresh.

### My changes are not showing on the live site
- Confirm you committed on **your fork**, not the original starter repo.
- GitHub Pages deploys usually take **1–5 minutes** after a commit.
- Check your repo **Actions** tab for a failed Pages build.
- Hard-refresh the browser (or try a private/incognito window).

### `permission-denied` when saving/opening
- Firestore rules were not published.
- Or rules were edited incorrectly.
- Re-copy `firebase/firestore.rules` from your fork, paste in Firebase Rules, and **Publish**.

### `auth/unauthorized-domain`
- Add **`your-github-username.github.io`** in Firebase → Authentication → Settings → Authorized domains.

### Sign-in popup does not open
- Browser blocked popups; allow popups for your live site URL.

### You can sign in but cannot enter the desk
- Signed-in email is not listed in `authorization.js` on your fork.
- Edit the file on GitHub, commit, wait for redeploy, and try again.

### If your site does not appear at all
- Confirm Pages is set to `main` + **`/src`** (not root `/`).
- Confirm the repo is **Public** (simplest path) or that your GitHub plan supports Pages for private repos.
- Wait a few more minutes and refresh the Pages settings screen.

---

## 10) Security reminders

- Frontend allowlist alone is not enough security.
- Keep Firestore rules strict.
- Test with a second account to confirm blocked access works.

---

## Optional: local preview on your computer

This is **not required** for the setup above. Only use this if you want to run Typer at `http://localhost:8000/` before or alongside your live GitHub Pages site.

You will need to download your fork, install Python 3, and run `pip install -r requirements-dev.txt` and `python devserver.py` from the project root. If you use local preview, also add **`localhost`** to Firebase **Authorized domains**.

See the original `README.md` in this repository for the full local-setup instructions.

---

## Support Development

I build and maintain this project as an independent developer.

If this tool has been useful to you and you'd like to support future improvements, you can do so here:

☕ https://paypal.me/trvrj

Thank you for trying the app. I hope it helps you create something meaningful.
