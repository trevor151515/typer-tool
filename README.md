# Public Typer Tool Starter

This folder is a standalone starter you can publish in a separate public GitHub repo.

It provides:
- A two-page writing tool (`auth` + `desk`)
- Firebase Auth support for **Google** and **Email/Password**
- Firestore-backed draft save/load
- Client-side email allowlist gating (with secure Firestore rules)

## 1) Starter file structure

```
public typer tool/
  README.md
  devserver.py
  requirements-dev.txt
  firebase/
    firestore.rules
    firestore.indexes.json
  src/
    index.html
    styles.css
    auth/
      index.html
      scripts/main.js
    desk/
      index.html
      scripts/main.js
    scripts/
      auth.js
      authPage.js
      authorization.js
      deskPage.js
      draftFirestore.js
      firebaseClient.js
      firebaseConfig.js
      fullscreenDesk.js
      typewriter/
        mountTypewriter.js
        typewriter.js
```

## 2) Quick local run

1. Copy this folder into a new repo (recommended name: `typer-tool-starter`).
2. From that repo root:

```bash
pip install -r requirements-dev.txt
python devserver.py
```

3. Open `http://localhost:8000/` (it redirects to `/auth/`).

## 3) Firebase setup (required)

### 3.1 Create a Firebase project + Web app

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a project.
3. In **Project settings -> General -> Your apps**, create a **Web app**.
4. Copy the config values and paste into:
   - `src/scripts/firebaseConfig.js`

Replace all `PASTE_*` fields:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

## 3.2 Enable Authentication providers

In **Authentication -> Sign-in method**, enable:
- Google
- Email/Password

### Google
- Enable provider.
- Set support email.

### Email/Password
- Enable Email/Password provider.
- Official Apple Sign In typically requires an Apple Developer account (about $100/year).
- Users can still sign up and sign in with Apple-hosted email addresses using Email/Password.

### Authorized domains
In **Authentication -> Settings -> Authorized domains**, add:
- `localhost`
- Your production domain (for example `yourdomain.com`)

## 3.3 Create Firestore database

1. In **Firestore Database**, create database (production mode recommended).
2. Open **Rules** and paste `firebase/firestore.rules`.
3. Publish rules.

Rules model used by this starter:
- Drafts live at `typerDrafts/{uid}/files/{docId}`
- Only signed-in user matching `{uid}` can read/write those docs.

## 4) Configure access allowlist

Edit:
- `src/scripts/authorization.js`

Replace `allowedEmails` with real emails:

```js
export const allowedEmails = [
  "you@example.com",
  "collaborator@example.com"
];
```

Important:
- This allowlist is **client-side UX gating**.
- Security enforcement is still in Firestore rules.

## 5) Data model used by the app

Firestore path:

```
typerDrafts/{uid}/files/{docId}
```

Document fields:
- `content: string`
- `updatedAt: serverTimestamp`

Behavior:
- `New`: creates empty document with chosen title
- `Open`: lists current user's docs sorted by `updatedAt desc`
- `Save`: manual save
- Autosave every 60 seconds
- Last opened doc is remembered in `localStorage`

## 6) Publish to GitHub (public repo)

1. Create a new repo on GitHub (Public).
2. Push this starter:

```bash
git init
git add .
git commit -m "Initial public typer starter"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

3. Deploy static files with your preferred host:
- GitHub Pages
- Netlify
- Vercel static
- Firebase Hosting

Make sure deployed auth domain is in Firebase Authorized domains.

## 7) End-to-end verification checklist

- [ ] `src/scripts/firebaseConfig.js` has real values (no `PASTE_*`)
- [ ] Google sign-in works
- [ ] Email/password registration works
- [ ] Email/password sign-in works
- [ ] Non-allowlisted users are blocked from desk
- [ ] Allowlisted users reach desk
- [ ] `New` creates a draft
- [ ] `Open` lists existing drafts
- [ ] `Save` and autosave persist text
- [ ] Data appears in Firestore under `typerDrafts/{uid}/files/{docId}`

## 8) Common issues

### "Firebase not configured" message
- You still have `PASTE_*` in `src/scripts/firebaseConfig.js`.

### `permission-denied` on save/open
- Firestore rules were not published or path mismatch.
- Confirm your rules allow `typerDrafts/{uid}/files/{fileId}` for `request.auth.uid == uid`.

### `auth/unauthorized-domain`
- Add your current host to Firebase Authorized domains.

### Popup blocked by browser
- Allow popups for your local or deployed domain.

## 9) Security notes for repo users

- Firebase web config values are not secrets.
- Never trust client-only checks for security.
- Keep Firestore rules strict and test with a second account.
- If you later remove the allowlist, keep per-user UID rules in place.

