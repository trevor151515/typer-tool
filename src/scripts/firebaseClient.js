import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";

const hasPlaceholder = (value) => String(value ?? "").includes("PASTE_");
const isFirebaseConfigPlaceholder =
    !firebaseConfig ||
    hasPlaceholder(firebaseConfig.apiKey) ||
    hasPlaceholder(firebaseConfig.authDomain) ||
    hasPlaceholder(firebaseConfig.projectId) ||
    hasPlaceholder(firebaseConfig.storageBucket) ||
    hasPlaceholder(firebaseConfig.messagingSenderId) ||
    hasPlaceholder(firebaseConfig.appId);

export const isFirebaseConfigured = !isFirebaseConfigPlaceholder;
export const firebaseConfigError = isFirebaseConfigPlaceholder
    ? "Firebase not configured. Set values in src/scripts/firebaseConfig.js."
    : "";

export const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const auth = isFirebaseConfigured ? getAuth(app) : null;
export const db = isFirebaseConfigured ? getFirestore(app) : null;
export const googleProvider = isFirebaseConfigured ? new GoogleAuthProvider() : null;
