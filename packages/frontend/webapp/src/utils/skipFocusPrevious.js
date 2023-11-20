import skipFocus from "./skipFocus";

export function skipFocusPrevious(el) {
    return skipFocus(el.previousElementSibling || el.parentNode, "top", el);
}
