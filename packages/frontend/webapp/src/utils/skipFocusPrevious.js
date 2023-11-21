import skipFocus from "./skipFocus";

export default function skipFocusPrevious(el) {
    return skipFocus(el.previousElementSibling || el.parentNode, "top", el);
}
