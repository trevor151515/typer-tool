import { subscribeToAuthChanges, signOutUser } from "./auth.js";
import { firebaseConfigError } from "./firebaseClient.js";
import { isUserAuthorizedByEmail } from "./authorization.js";
import { mountTypewriter } from "./typewriter/mountTypewriter.js";
import {
    draftHasNonEmptyContent,
    listTyperDocs,
    loadTyperDraft,
    sanitizeDocId,
    saveTyperDraft,
} from "./draftFirestore.js";
import {
    exitDocumentFullscreen,
    getFullscreenElement,
    requestDocumentFullscreen,
} from "./fullscreenDesk.js";

const AUTOSAVE_MS = 60_000;

function storageDocKey(uid) {
    return `typer.docId.${uid}`;
}

function countWords(text) {
    const trimmed = String(text || "").trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
}

function formatNow() {
    return new Date().toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
    });
}

function firestoreErrorHint(err) {
    if (err?.code === "permission-denied") {
        return "Permission denied. Check Firestore rules for typerDrafts/{uid}/files/{fileId}.";
    }
    return err?.message ? String(err.message) : "Firestore request failed.";
}

function renderDesk(root) {
    root.innerHTML = `
        <div class="desk-shell">
            <div class="desk-toolbar">
                <div class="desk-toolbar-left">
                    <button class="link-btn" data-action="new">New</button>
                    <span>|</span>
                    <button class="link-btn" data-action="open">Open</button>
                    <span>|</span>
                    <button class="link-btn" data-action="read">Read</button>
                    <span>|</span>
                    <button class="link-btn" data-action="focus">Focus</button>
                    <span>|</span>
                    <button class="link-btn" data-action="save">Save</button>
                    <span>|</span>
                    <button class="link-btn" data-action="logout">Logout</button>
                </div>
                <div class="desk-toolbar-right">
                    <span>Words: <strong id="word-count">0</strong></span>
                    <span>|</span>
                    <span>Last saved: <strong id="last-saved">-</strong></span>
                </div>
            </div>

            <div class="desk-doc-title" id="doc-title" hidden></div>
            <div id="typewriter-root" class="typewriter-root-wrap"></div>

            <div class="overlay" id="open-overlay" hidden aria-hidden="true">
                <div class="overlay-card">
                    <h2>Open document</h2>
                    <div id="open-list" class="open-list">Loading...</div>
                    <div class="overlay-actions">
                        <button class="btn btn-secondary" data-action="close-open">Close</button>
                    </div>
                </div>
            </div>

            <div class="overlay" id="read-overlay" hidden aria-hidden="true">
                <div class="overlay-card">
                    <h2>Read mode</h2>
                    <pre id="read-content" class="read-content"></pre>
                    <div class="overlay-actions">
                        <button class="btn btn-secondary" data-action="close-read">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initDeskPage({ rootId, redirectIfNotAuthedTo }) {
    const root = document.getElementById(rootId);
    if (!root) return;

    root.innerHTML = `<p class="muted">Loading...</p>`;
    if (firebaseConfigError) {
        root.innerHTML = `<p class="error">${firebaseConfigError}</p>`;
        return;
    }

    subscribeToAuthChanges(async (user) => {
        if (!user) {
            if (redirectIfNotAuthedTo) window.location.replace(redirectIfNotAuthedTo);
            return;
        }

        const email = user.email ?? "";
        if (!isUserAuthorizedByEmail(email)) {
            try {
                await signOutUser();
            } finally {
                if (redirectIfNotAuthedTo) window.location.replace(redirectIfNotAuthedTo);
            }
            return;
        }

        renderDesk(root);
        const tw = mountTypewriter({ root: root.querySelector("#typewriter-root") });
        if (!tw) return;

        const uid = user.uid;
        let activeDocId = null;
        let lastPersisted = null;

        const wordCountEl = root.querySelector("#word-count");
        const lastSavedEl = root.querySelector("#last-saved");
        const docTitleEl = root.querySelector("#doc-title");
        const openOverlay = root.querySelector("#open-overlay");
        const openListEl = root.querySelector("#open-list");
        const readOverlay = root.querySelector("#read-overlay");
        const readContent = root.querySelector("#read-content");

        function setDocTitle(docId) {
            if (!docTitleEl) return;
            if (!docId) {
                docTitleEl.hidden = true;
                docTitleEl.textContent = "";
                return;
            }
            docTitleEl.hidden = false;
            docTitleEl.textContent = docId;
        }

        function setLastSaved(text) {
            if (lastSavedEl) lastSavedEl.textContent = text;
        }

        function updateWordCount() {
            if (!wordCountEl) return;
            wordCountEl.textContent = String(countWords(tw.getValue()));
        }

        async function persistCurrentDoc() {
            if (!activeDocId) return;
            const content = tw.getValue();
            if (content === lastPersisted) return;
            await saveTyperDraft(uid, activeDocId, content);
            lastPersisted = content;
            setLastSaved(formatNow());
        }

        async function openDoc(docId) {
            const clean = sanitizeDocId(docId);
            if (!clean) return false;
            if (activeDocId === clean) return true;
            if (activeDocId) await persistCurrentDoc();

            const content = await loadTyperDraft(uid, clean);
            tw.setValue(content);
            activeDocId = clean;
            lastPersisted = content;
            setDocTitle(clean);
            setLastSaved(content ? "draft loaded" : "-");
            updateWordCount();
            try {
                localStorage.setItem(storageDocKey(uid), clean);
            } catch (_) {
                // ignore localStorage errors
            }
            return true;
        }

        async function createNewDoc() {
            const raw = window.prompt("New document title:");
            const docId = sanitizeDocId(raw);
            if (!docId) return;

            if (activeDocId) {
                try {
                    await persistCurrentDoc();
                } catch (err) {
                    setLastSaved("save failed");
                    window.alert(`Could not save current doc: ${firestoreErrorHint(err)}`);
                    return;
                }
            }

            try {
                const taken = await draftHasNonEmptyContent(uid, docId);
                if (taken) {
                    window.alert("That title already exists with content. Choose another one.");
                    return;
                }
                await saveTyperDraft(uid, docId, "");
                tw.setValue("");
                activeDocId = docId;
                lastPersisted = "";
                setDocTitle(docId);
                setLastSaved(formatNow());
                updateWordCount();
                try {
                    localStorage.setItem(storageDocKey(uid), docId);
                } catch (_) {
                    // ignore localStorage errors
                }
            } catch (err) {
                window.alert(firestoreErrorHint(err));
            }
        }

        async function openFilePicker() {
            if (!openOverlay || !openListEl) return;
            openOverlay.hidden = false;
            openOverlay.setAttribute("aria-hidden", "false");
            openListEl.textContent = "Loading...";
            try {
                const docs = await listTyperDocs(uid);
                openListEl.innerHTML = "";
                if (!docs.length) {
                    openListEl.textContent = "No documents yet.";
                    return;
                }
                for (const doc of docs) {
                    const button = document.createElement("button");
                    button.className = "open-item";
                    button.type = "button";
                    button.dataset.docId = doc.docId;
                    button.textContent = doc.docId;
                    openListEl.appendChild(button);
                }
            } catch (err) {
                openListEl.textContent = firestoreErrorHint(err);
            }
        }

        function closeOpenOverlay() {
            if (!openOverlay) return;
            openOverlay.hidden = true;
            openOverlay.setAttribute("aria-hidden", "true");
        }

        function openReadOverlay() {
            if (!readOverlay || !readContent) return;
            readContent.textContent = tw.getValue();
            readOverlay.hidden = false;
            readOverlay.setAttribute("aria-hidden", "false");
        }

        function closeReadOverlay() {
            if (!readOverlay) return;
            readOverlay.hidden = true;
            readOverlay.setAttribute("aria-hidden", "true");
        }

        async function toggleFocus() {
            const shell = root.querySelector(".desk-shell");
            const focused = shell?.classList.contains("focus-mode");
            if (!focused) {
                shell?.classList.add("focus-mode");
                try {
                    await requestDocumentFullscreen();
                } catch (_) {
                    // fullscreen can fail depending on browser permissions
                }
                return;
            }
            shell?.classList.remove("focus-mode");
            try {
                await exitDocumentFullscreen();
            } catch (_) {
                // ignore
            }
        }

        function syncFocusState() {
            const shell = root.querySelector(".desk-shell");
            if (!getFullscreenElement()) shell?.classList.remove("focus-mode");
        }

        document.addEventListener("fullscreenchange", syncFocusState);
        document.addEventListener("webkitfullscreenchange", syncFocusState);

        root.addEventListener("click", async (event) => {
            const openItem = event.target?.closest?.(".open-item");
            if (openItem) {
                const docId = openItem.dataset.docId;
                if (docId) {
                    await openDoc(docId);
                    closeOpenOverlay();
                }
                return;
            }

            const button = event.target?.closest?.("button[data-action]");
            const action = button?.getAttribute?.("data-action");
            if (!action) return;

            if (action === "new") {
                await createNewDoc();
                return;
            }
            if (action === "open") {
                await openFilePicker();
                return;
            }
            if (action === "close-open") {
                closeOpenOverlay();
                return;
            }
            if (action === "read") {
                openReadOverlay();
                return;
            }
            if (action === "close-read") {
                closeReadOverlay();
                return;
            }
            if (action === "focus") {
                await toggleFocus();
                return;
            }
            if (action === "save") {
                if (!activeDocId) {
                    window.alert("Open or create a document first.");
                    return;
                }
                try {
                    await persistCurrentDoc();
                } catch (err) {
                    setLastSaved("save failed");
                    window.alert(firestoreErrorHint(err));
                }
                return;
            }
            if (action === "logout") {
                try {
                    await persistCurrentDoc();
                } catch (_) {
                    // ignore and continue logout
                }
                await signOutUser();
                if (redirectIfNotAuthedTo) window.location.replace(redirectIfNotAuthedTo);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;
            if (readOverlay && !readOverlay.hidden) closeReadOverlay();
            if (openOverlay && !openOverlay.hidden) closeOpenOverlay();
        });

        tw.el.addEventListener("input", updateWordCount);
        updateWordCount();

        try {
            const storedDocId = localStorage.getItem(storageDocKey(uid));
            if (storedDocId) {
                await openDoc(storedDocId);
            } else {
                setLastSaved("-");
            }
        } catch (_) {
            setLastSaved("-");
        }

        const timerId = window.setInterval(async () => {
            try {
                await persistCurrentDoc();
            } catch (_) {
                setLastSaved("save failed");
            }
        }, AUTOSAVE_MS);

        window.addEventListener(
            "beforeunload",
            () => {
                window.clearInterval(timerId);
            },
            { once: true },
        );
    });
}
