# Typer Tool setup

This project gives you a private writing environment with:
- sign-in (Google + Email/Password)
- saved drafts in Firestore
- a simple allowlist so only specific emails can enter

Typer Tool gives you a minimalist, distraction-free environment that you can access from any device with an internet connection: a smartphone, tablet, laptop, desktop, or a work terminal that has a browser.

If you are not a tech user, skip the 10-minute quickstart and follow the step-by-step procedure below.

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

## 10-minute quickstart (summarized)

If you are a tech user and familiar with GitHub, follow these steps to get setup quickly:

1. **Create your GitHub fork and download the project**
   - If you do not have a GitHub account yet, create one and then return to this page.
   - Click **Fork** (top right) → **Create fork**. This copies the project into your own GitHub account so you have a personal version to configure and deploy later.
   - On **your fork** (`https://github.com/<your-github-username>/typer-tool`), click the green **Code** button, then **Download ZIP**.
   - When the download finishes:
     - **Windows:** open your **Downloads** folder, right-click the ZIP file → **Extract All** → choose a location (for example **Documents**). Open the extracted folder — it is usually named `typer-tool-main`.
     - **Mac:** open **Downloads**, double-click the ZIP file to unzip it. Open the extracted folder — it is usually named `typer-tool-main`.
   - Confirm you are in the **project root**: you should see `README.md` and `devserver.py` in the same folder. You will use this folder for all terminal steps below.

2. **Install Python (one-time, if you do not already have it)**
   - Download **Python 3** from [python.org/downloads](https://www.python.org/downloads/) and run the installer.
   - **Windows:** on the first installer screen, check **Add python.exe to PATH**, then choose **Install Now**.
   - **Mac:** download the macOS installer from python.org and run through the prompts (no PATH checkbox).
   - **Open a terminal in the project root** (where `README.md` and `devserver.py` are):
     - **Windows:** open that folder in File Explorer. Click the address bar at the top, type `cmd`, press **Enter** (Command Prompt opens in that folder).  
       Or right-click inside the folder → **Open in Terminal** (Windows 11) or **Open PowerShell window here**.
     - **Mac:** in Finder, open the project folder, then right-click the folder background → **New Terminal at Folder**.  
       Or open **Terminal** (Applications → Utilities), type `cd ` (with a space after it), drag the project folder into the window, press **Enter**.
   - In that terminal, verify:
     ```bash
     python --version
     pip --version
     ```
   - Each command should print a version number. That confirms Python is installed and ready for the next step.

3. **Start the local site**
   - Run:
     ```bash
     pip install -r requirements-dev.txt
     python devserver.py
     ```
   - What these commands do:
     - `pip install -r requirements-dev.txt` installs the tiny Python package needed to run the local preview server.
     - `python devserver.py` starts a local website server on your computer so you can open the app in your browser.
   - Open `http://localhost:8000/`.

4. **Create Firebase project + web app**
   - Firebase Console -> create project.
   - Project settings -> General -> add Web app (`</>`).
   - Copy config values into `src/scripts/firebaseConfig.js`.

5. **Enable auth**
   - Security -> Authentication -> Get started.
   - Enable **Google** and **Email/Password**.
   - Authentication -> Settings -> add authorized domain `localhost`.

6. **Enable Firestore**
   - Databases & Storage -> Firestore -> Create database.
   - Use **Standard** and **Production mode**.
   - Firestore -> Rules -> paste `firebase/firestore.rules` -> Publish.

7. **Allow your email**
   - Open `src/scripts/authorization.js`.
   - Replace sample emails in `allowedEmails` with your real email.

8. **Test**
   - Go to `http://localhost:8000/`.
   - Sign in.
   - Create a new document and type.
   - Confirm data appears in Firestore under `typerDrafts/{uid}/files/{docId}`.

If you get stuck, use the full step-by-step guide below.

## Step-by-step guide to setting up your Typer Tool

## 1) Get the project on your computer

These steps will allow you to **fork** the Typer Tool repo and download the project to your computer.

### Create a GitHub account and fork Typer Tool

You will work from **your own fork** of the starter repo (not a direct copy of someone else’s). That way your Firebase settings, allowlist, and GitHub Pages site all belong to your account.

1. If you do not have a GitHub account yet, create one and then return to this page.
2. Click **Fork** (top right of the page) → **Create fork**.
3. GitHub copies the repo to your account. When it finishes, you should be on `https://github.com/<your-github-username>/typer-tool` — that is **your fork**.

### Download your fork to your computer

1. On your fork’s page (`https://github.com/<your-github-username>/typer-tool`), click the green **Code** button.
2. Click **Download ZIP**.
3. When the download finishes:
   - **Windows:** open your **Downloads** folder. Right-click the ZIP file → **Extract All** → choose a location (for example **Documents**). Open the extracted folder.
   - **Mac:** open **Downloads** and double-click the ZIP file to unzip it. Open the extracted folder.
4. The extracted folder is usually named `typer-tool-main`. That folder is your **project root**. You can rename it to `typer-tool` if you want.
5. Open the project root and confirm you see `README.md` and `devserver.py` in the same folder. Keep this folder location in mind — you will return here for terminal commands and file edits.

### Files you should have

Inside the project root, you should see:

```
README.md
devserver.py
requirements-dev.txt
firebase/firestore.rules
firebase/firestore.indexes.json
src/...
```

Do not rename these folders unless you also update code paths.

## 2) Optional: server starts check (before Firebase)

This step only confirms that your local server can start.
At this stage, Firebase is not set up yet, so full sign-in/save behavior is not expected.

### Open a terminal (Windows / Mac)

Open the project root in Finder or File Explorer first (where `README.md` and `devserver.py` are).

- **Windows:** click the folder’s address bar, type `cmd`, press **Enter**.  
  Or right-click inside the folder → **Open in Terminal** (Windows 11) or **Open PowerShell window here**.
- **Mac:** in Finder, right-click the folder background → **New Terminal at Folder**.  
  Or open **Terminal** (Applications → Utilities), type `cd ` (with a space), drag the project folder into the window, press **Enter**.

### Install Python first (if needed)

The local preview uses small Python tools. If `python` or `pip` is not recognized in your terminal, install **Python 3** first:

1. Download from [python.org/downloads](https://www.python.org/downloads/) and run the installer.
2. **Windows:** check **Add python.exe to PATH** on the installer’s first screen.
3. **Mac:** download the macOS installer from python.org and run through the prompts (no PATH checkbox).
4. In the terminal you opened above, verify:
   ```bash
   python --version
   pip --version
   ```
   Each command should print a version number.

### What to do

1. With the terminal open in the project root, run:

```bash
pip install -r requirements-dev.txt
python devserver.py
```

What these commands do:
- `pip install -r requirements-dev.txt` installs required Python tools for local preview.
- `python devserver.py` launches a local web server for this project.

2. Open your browser and go to `http://localhost:8000/`.

### What you should see

- The page opens and redirects to `/auth/`.
- You should see the Typer auth page load.
- You may also see a Firebase configuration message until setup is completed in Section 3.

If you do not see the page:
- If the terminal says `python` or `pip` is not recognized, install Python (see **Install Python first** above), open a **new** terminal window, and try again. On Mac, if needed, use `python3` instead of `python`.
- Make sure your terminal is open in the **project root** — the top-level folder where `README.md` and `devserver.py` sit side by side (not inside `src/`).
- If port 8000 is busy, stop other local servers and run `python devserver.py` again.

## 3) Firebase setup (required)

### 3.1 Create a Firebase project and web app

1. Open [Firebase Console](https://console.firebase.google.com/).
2. Click **Create a project**.
3. Enter a project name and continue.
4. After project creation, click the **gear icon** (Project settings).
5. In **General -> Your apps**, click the **Web icon** (`</>`) to create a Web app.
6. Register the app (nickname can be anything, example: `typer-web`).
7. Firebase shows your web app config. Copy this entire block (you will use all six):
   - `apiKey: <Firebase value>`
   - `authDomain: <Firebase value>`
   - `projectId: <Firebase value>`
   - `storageBucket: <Firebase value>`
   - `messagingSenderId: <Firebase value>`
   - `appId: <Firebase value>`
8. Go back to your **Typer Tool project folder**, open `src/scripts/firebaseConfig.js`.
   - Before you edit: you must keep the same indentation as the original file when you paste — note what this indentation looks like before you begin, in case you have to fix it; each line should stay lined up inside the `{ ... }` block.
9. In that file, select this entire block with placeholder values and paste the matching real values you copied from Firebase in step 7.
   - `apiKey: <Placeholder value>`
   - `authDomain: <Placeholder value>`
   - `projectId: <Placeholder value>`
   - `storageBucket: <Placeholder value>`
   - `messagingSenderId: <Placeholder value>`
   - `appId: <Placeholder value>`

Important:
- These values are safe to put in frontend code.
- If you leave even one `PASTE_*`, the app will show "Firebase not configured."

### 3.2 Enable Authentication providers

In Firebase Console:
1. Go to **Security -> Authentication**.
2. Click **Get started**.
3. Open **Sign-in method** tab.
4. Enable:
   - **Google**
   - **Email/Password**

Google:
- Enable provider.
- Choose a support email.

Email/Password:
- Enable Email/Password provider.

Apple note:
- Official Apple Sign In usually requires an Apple Developer account (about `$100/year`).
- To avoid that, users can still use Apple-hosted email addresses with Email/Password sign-in.

Authorized domains:
1. In Authentication, open **Settings** tab.
2. Under **Authorized domains**, add:
   - `localhost`
   - your real website domain (example: `yourdomain.com`)

### 3.3 Create Firestore database

In Firebase Console:
1. Go to **Databases & Storage -> Firestore**.
2. Click **Create database**.
3. Choose **Standard** edition.
4. For Database ID and location, use the default populated values unless you have a specific reason to change them.
5. Choose **Start in production mode**.
6. Click **Create** / **Enable**.

Now set rules:
1. Open Firestore **Rules** tab.
2. Copy contents from `firebase/firestore.rules`.
3. Paste into Firebase Rules editor.
4. Click **Publish**.

Rules behavior:
- Drafts are saved under `typerDrafts/{uid}/files/{docId}`.
- Only the signed-in user with that `uid` can read/write that path.

## 4) Configure allowlist (who can access the desk)

Open:
- `src/scripts/authorization.js`

Replace `allowedEmails` with real email addresses:

```js
export const allowedEmails = [
  "you@example.com",
  "collaborator@example.com"
];
```

Do this:
- remove all dummy/sample emails
- keep only real accounts you want to allow

Important:
- This allowlist is website-level UX gating.
- Firestore rules are still the actual security layer.

## 5) Firestore data setup (what users often miss)

You do **not** need to manually create Firestore collections/documents first.

The app creates them automatically the first time a signed-in allowlisted user:
1. enters the desk
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

How to verify this in Firebase:
1. Open Firestore **Data** tab.
2. Sign in on your app and create/save one document.
3. Refresh Data tab.
4. You should see:
   - collection `typerDrafts`
   - your user `uid`
   - subcollection `files`
   - your doc title as `docId`

If you do not see data:
- usually rules were not published
- or current signed-in email is not in `allowedEmails`

## 6) Run locally + real test (after Firebase setup)

Now that Sections 3, 4, and 5 are complete, do a full working test:

1. In your project folder, run:

```bash
python devserver.py
```

2. Open `http://localhost:8000/`.
3. Sign in with an allowlisted account.
4. Click **New**, enter a title, and confirm.
5. Start typing in the new document.
6. Click **Save** once.
7. In Firebase Firestore **Data**, confirm the document appears under `typerDrafts/{uid}/files/{docId}`.

If all of these steps work, your setup is complete.

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

## 7) Put this on GitHub (beginner-friendly)

If you are not comfortable with terminal commands, use the GitHub website upload flow.

### Option A (easiest): Upload from GitHub website

1. Go to [GitHub](https://github.com/) and create a new repository.
2. Set visibility to **Public** (or Private if you prefer).
3. Open the new repo page.
4. Click **Add file -> Upload files**.
5. Drag all project files/folders into the upload area.
6. Scroll down, enter commit message (example: `Initial Typer starter`).
7. Click **Commit changes**.

### Option B (terminal/git users)

```bash
git init
git add .
git commit -m "Initial Typer starter"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

What these commands do:
- `git init` creates a new local Git repository in this folder.
- `git add .` stages all current files.
- `git commit -m "Initial Typer starter"` creates your first saved snapshot.
- `git branch -M main` names your primary branch `main`.
- `git remote add origin ...` connects your local repo to your GitHub repo URL.
- `git push -u origin main` uploads your files to GitHub.

## 8) Deploy with GitHub Pages (beginner-friendly)

This section is for non-technical users who want a live website URL from the same GitHub repo.

### Before you start

- Make sure your files are already pushed to GitHub.
- Easiest path: use a **Public** GitHub repo.
- This project uses `src` as the publish folder (that is expected).

### Step-by-step: turn on GitHub Pages

1. Open your repository on GitHub.
2. Click the **Settings** tab (top of repo page).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment**:
   - **Source**: choose **Deploy from a branch**
   - **Branch**: choose `main`
   - **Folder**: choose `/src`
5. Click **Save**.

### What happens next

- GitHub starts building your Pages site.
- Wait 1-5 minutes (sometimes a bit longer on first deploy).
- Refresh the Pages settings screen until you see a live URL.
- Your site URL will look like:
  - `https://<your-github-username>.github.io/<repo-name>/`

### Connect deployed URL to Firebase (required)

If you skip this, sign-in will fail.

1. Copy your GitHub Pages URL/domain.
2. Open Firebase Console -> **Authentication** -> **Settings**.
3. Under **Authorized domains**, add your GitHub Pages domain.
   - Usually `your-github-username.github.io`
4. Save.

### Final deploy check

1. Open your live GitHub Pages URL.
2. Sign in.
3. Click **New**, enter a title, start typing.
4. Click **Save**.
5. In Firestore **Data**, confirm document appears under `typerDrafts/{uid}/files/{docId}`.

### If your site does not appear

- Confirm Pages is set to `main` + `/src` (not root `/`).
- Confirm your latest files were pushed to GitHub.
- Wait a few more minutes and refresh.
- Check repo **Actions** tab for a failed Pages build.

## 9) Final checklist

- [ ] `src/scripts/firebaseConfig.js` has no `PASTE_*` values
- [ ] `allowedEmails` has real emails only
- [ ] Google sign-in works
- [ ] Email/password registration works
- [ ] Email/password sign-in works
- [ ] Non-allowlisted users are blocked
- [ ] Allowlisted users can open desk
- [ ] New/Open/Save works
- [ ] Firestore shows docs at `typerDrafts/{uid}/files/{docId}`

## 10) Troubleshooting

### "Firebase not configured"
- One or more `PASTE_*` values still exist in `src/scripts/firebaseConfig.js`.

### `permission-denied` when saving/opening
- Firestore rules were not published.
- Or rules were edited incorrectly.
- Re-paste `firebase/firestore.rules` and publish again.

### `auth/unauthorized-domain`
- Add your current domain in Firebase Authentication -> Settings -> Authorized domains.

### Sign-in popup does not open
- Browser blocked popups; allow popups for your site.

### You can sign in but cannot enter desk
- Signed-in email is not listed in `src/scripts/authorization.js`.

## 11) Security reminders

- Frontend allowlist alone is not enough security.
- Keep Firestore rules strict.
- Test with a second account to confirm blocked access works.

## Support Development

I build and maintain this project as an independent developer.

If this tool has been useful to you and you'd like to support future improvements, you can do so here:

☕ https://paypal.me/trvrj

Thank you for trying the app. I hope it helps you create something meaningful.
