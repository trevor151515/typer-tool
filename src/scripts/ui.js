function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

export function renderAuthLoading(root) {
    root.innerHTML = `<p class="muted">Loading auth...</p>`;
}

export function renderAuthUI(root, state) {
    const {
        busy,
        error,
        mode,
        userEmail,
        authorized,
        onGoogle,
        onEmailSignIn,
        onEmailRegister,
        onSignOut,
        onModeChange,
    } = state;

    const signedIn = Boolean(userEmail);
    const safeEmail = userEmail ? escapeHtml(userEmail) : "";
    const isAuthorized = signedIn && authorized;

    root.innerHTML = `
        <div class="auth-section">
            ${
                signedIn
                    ? `<p class="${isAuthorized ? "ok" : "error"}">
                        Signed in as <strong>${safeEmail}</strong>${isAuthorized ? "" : " (not allowlisted)"}
                       </p>`
                    : `<p class="muted">Sign in to continue.</p>`
            }

            <div class="auth-buttons">
                <button class="btn" id="googleBtn" ${busy || signedIn ? "disabled" : ""}>Sign in with Google</button>
            </div>

            <div class="auth-mode-row">
                <button class="btn btn-secondary" id="modeSignIn" ${mode === "signin" ? "disabled" : ""}>Email Sign In</button>
                <button class="btn btn-secondary" id="modeRegister" ${mode === "register" ? "disabled" : ""}>Create Account</button>
            </div>

            <form id="emailForm" class="auth-form">
                <label>Email</label>
                <input id="emailInput" type="email" autocomplete="email" required ${busy || signedIn ? "disabled" : ""} />
                <label>Password</label>
                <input id="passwordInput" type="password" autocomplete="${mode === "register" ? "new-password" : "current-password"}" required minlength="6" ${busy || signedIn ? "disabled" : ""} />
                <button class="btn" type="submit" ${busy || signedIn ? "disabled" : ""}>
                    ${mode === "register" ? "Create account" : "Sign in"}
                </button>
            </form>

            ${signedIn ? `<button class="btn btn-secondary" id="signOutBtn" ${busy ? "disabled" : ""}>Sign out</button>` : ""}
            ${error ? `<p class="error">${escapeHtml(error)}</p>` : ""}
        </div>
    `;

    const googleBtn = root.querySelector("#googleBtn");
    const signOutBtn = root.querySelector("#signOutBtn");
    const emailForm = root.querySelector("#emailForm");
    const modeSignIn = root.querySelector("#modeSignIn");
    const modeRegister = root.querySelector("#modeRegister");
    const emailInput = root.querySelector("#emailInput");
    const passwordInput = root.querySelector("#passwordInput");

    if (googleBtn) googleBtn.addEventListener("click", onGoogle);
    if (signOutBtn) signOutBtn.addEventListener("click", onSignOut);
    if (modeSignIn) modeSignIn.addEventListener("click", () => onModeChange("signin"));
    if (modeRegister) modeRegister.addEventListener("click", () => onModeChange("register"));

    if (emailForm) {
        emailForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const email = String(emailInput?.value || "").trim();
            const password = String(passwordInput?.value || "");
            if (mode === "register") onEmailRegister(email, password);
            else onEmailSignIn(email, password);
        });
    }
}
