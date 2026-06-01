import {
    auth,
    googleProvider,
    firebaseConfigError,
} from "./firebaseClient.js";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function subscribeToAuthChanges(callback) {
    if (!auth) {
        callback(null);
        return () => {};
    }
    return onAuthStateChanged(auth, callback);
}

export async function signInWithGooglePopup() {
    if (!auth || !googleProvider) {
        throw new Error(firebaseConfigError || "Google auth is not configured.");
    }
    return signInWithPopup(auth, googleProvider);
}

export async function signInWithEmailPassword(email, password) {
    if (!auth) {
        throw new Error(firebaseConfigError || "Email/password auth is not configured.");
    }
    return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmailPassword(email, password) {
    if (!auth) {
        throw new Error(firebaseConfigError || "Email/password auth is not configured.");
    }
    return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
    if (!auth) {
        throw new Error(firebaseConfigError || "Firebase auth is not configured.");
    }
    return signOut(auth);
}
