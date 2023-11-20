import skipFocus from "./skipFocus";

export function skipFocusNext(el) {
    return skipFocus(el.nextElementSibling || el.parentNode, "bottom", el);
}
