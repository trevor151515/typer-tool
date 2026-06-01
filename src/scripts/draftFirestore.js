import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebaseClient.js";

const ROOT_COLLECTION = "typerDrafts";
const FILES_COLLECTION = "files";

function fileDocRef(uid, docId) {
    return doc(db, ROOT_COLLECTION, uid, FILES_COLLECTION, docId);
}

function filesCollectionRef(uid) {
    return collection(db, ROOT_COLLECTION, uid, FILES_COLLECTION);
}

export function sanitizeDocId(raw) {
    const value = String(raw ?? "").trim();
    if (!value) return null;
    if (value === "." || value === "..") return null;
    if (value.includes("/")) return null;
    if (new TextEncoder().encode(value).length > 1500) return null;
    return value;
}

export async function loadTyperDraft(uid, docId) {
    if (!db || !uid || !docId) return "";
    const snap = await getDoc(fileDocRef(uid, docId));
    if (!snap.exists()) return "";
    const data = snap.data();
    return typeof data.content === "string" ? data.content : "";
}

export async function saveTyperDraft(uid, docId, content) {
    if (!db || !uid || !docId) {
        throw new Error("Firestore is not ready.");
    }
    await setDoc(
        fileDocRef(uid, docId),
        {
            content: String(content ?? ""),
            updatedAt: serverTimestamp(),
        },
        { merge: true },
    );
}

export async function listTyperDocs(uid) {
    if (!db || !uid) return [];
    const snap = await getDocs(query(filesCollectionRef(uid), orderBy("updatedAt", "desc")));
    return snap.docs.map((docSnap) => ({
        docId: docSnap.id,
        content: typeof docSnap.data().content === "string" ? docSnap.data().content : "",
    }));
}

export async function draftHasNonEmptyContent(uid, docId) {
    if (!db || !uid || !docId) return false;
    const snap = await getDoc(fileDocRef(uid, docId));
    if (!snap.exists()) return false;
    const content = typeof snap.data().content === "string" ? snap.data().content : "";
    return content.trim().length > 0;
}
