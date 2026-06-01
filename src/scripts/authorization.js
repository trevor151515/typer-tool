// Client-side allowlist. This improves UX but is not a security boundary by itself.
// Keep Firestore rules strict so users can only read/write their own docs.
export const allowedEmails = [
    "PASTE_ALLOWED_EMAIL_1@example.com",
    "PASTE_ALLOWED_EMAIL_2@example.com",
];

function normalizedAllowedEmails() {
    if (!Array.isArray(allowedEmails)) return [];
    return allowedEmails
        .map((email) => String(email || "").trim().toLowerCase())
        .filter((email) => email && !email.includes("PASTE_"));
}

export function isAuthorizationConfigured() {
    return normalizedAllowedEmails().length > 0;
}

export function isUserAuthorizedByEmail(userEmail) {
    const normalized = String(userEmail || "").trim().toLowerCase();
    if (!normalized) return false;
    return normalizedAllowedEmails().includes(normalized);
}

export function getAuthorizationError(userEmail) {
    if (!isAuthorizationConfigured()) {
        return "Set allowedEmails in src/scripts/authorization.js.";
    }
    if (!userEmail) return "";
    if (isUserAuthorizedByEmail(userEmail)) return "";
    return "Signed-in account is not in the allowlist.";
}
