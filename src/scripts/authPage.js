import {
    registerWithEmailPassword,
    signInWithEmailPassword,
    signInWithGooglePopup,
    signOutUser,
    subscribeToAuthChanges,
} from "./auth.js";
import { firebaseConfigError } from "./firebaseClient.js";
import {
    getAuthorizationError,
    isAuthorizationConfigured,
    isUserAuthorizedByEmail,
} from "./authorization.js";
import { renderAuthLoading, renderAuthUI } from "./ui.js";

export function initAuthPage({ rootId, redirectOnSuccessTo }) {
    const root = document.getElementById(rootId);
    if (!root) return;

    let busy = false;
    let mode = "signin";
    let error = firebaseConfigError || "";
    let currentUserEmail = null;
    let authorized = false;

    renderAuthLoading(root);

    function updateUI() {
        renderAuthUI(root, {
            busy,
            mode,
            error,
            userEmail: currentUserEmail,
            authorized,
            onGoogle: onGoogle,
            onEmailSignIn: onEmailSignIn,
            onEmailRegister: onEmailRegister,
            onSignOut: onSignOut,
            onModeChange: onModeChange,
        });
    }

    function onModeChange(nextMode) {
        mode = nextMode === "register" ? "register" : "signin";
        error = "";
        updateUI();
    }

    async function guarded(action) {
        if (busy) return;
        busy = true;
        error = "";
        updateUI();
        try {
            await action();
        } catch (err) {
            error = err?.message ? String(err.message) : "Authentication failed.";
        } finally {
            busy = false;
            updateUI();
        }
    }

    function onGoogle() {
        return guarded(() => signInWithGooglePopup());
    }

    function onEmailSignIn(email, password) {
        return guarded(() => signInWithEmailPassword(email, password));
    }

    function onEmailRegister(email, password) {
        return guarded(() => registerWithEmailPassword(email, password));
    }

    function onSignOut() {
        return guarded(() => signOutUser());
    }

    subscribeToAuthChanges((user) => {
        currentUserEmail = user?.email ?? null;
        busy = false;

        if (!user) {
            authorized = false;
            error = firebaseConfigError || "";
            updateUI();
            return;
        }

        authorized = isUserAuthorizedByEmail(currentUserEmail);
        error = getAuthorizationError(currentUserEmail);
        if (!isAuthorizationConfigured()) {
            error = "Set allowedEmails before using this starter.";
        }

        if (authorized && redirectOnSuccessTo) {
            window.location.replace(redirectOnSuccessTo);
            return;
        }

        updateUI();
    });
}
