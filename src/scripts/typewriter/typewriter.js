export function createTypewriter({ fontSizePx, lineHeight, visibleLines }) {
    const textarea = document.createElement("textarea");
    textarea.className = "typewriter-textarea";
    textarea.spellcheck = false;
    textarea.autocapitalize = "off";
    textarea.autocomplete = "off";
    textarea.wrap = "soft";
    textarea.style.fontSize = `${fontSizePx}px`;
    textarea.style.lineHeight = String(lineHeight);
    textarea.style.height = `calc(${visibleLines} * ${lineHeight}em)`;

    const lineHeightPx = fontSizePx * lineHeight;
    const activeLineOffsetPx = Math.round((visibleLines - 0.5) * lineHeightPx);
    const visibleHeightPx = Math.round(visibleLines * lineHeightPx);
    const initialTopOffsetPx = Math.round((visibleLines - 1) * lineHeightPx);

    textarea.style.paddingTop = `${initialTopOffsetPx}px`;
    textarea.style.paddingBottom = "0px";

    function anchorActiveLine() {
        const maxScroll = Math.max(0, textarea.scrollHeight - textarea.clientHeight);
        textarea.scrollTop = maxScroll;
    }

    textarea.addEventListener("input", anchorActiveLine);
    window.addEventListener("resize", anchorActiveLine, { passive: true });
    queueMicrotask(anchorActiveLine);

    return {
        el: textarea,
        metrics: {
            activeLineOffsetPx,
            visibleHeightPx,
        },
        focus: () => textarea.focus(),
        getValue: () => textarea.value,
        setValue: (value) => {
            textarea.value = String(value ?? "");
            anchorActiveLine();
        },
        destroy: () => {
            textarea.removeEventListener("input", anchorActiveLine);
            window.removeEventListener("resize", anchorActiveLine);
        },
    };
}
