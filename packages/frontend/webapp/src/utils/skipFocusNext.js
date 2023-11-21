import skipFocus from "./skipFocus";

export default function skipFocusNext(el) {
    return skipFocus(el.nextElementSibling || el.parentNode, "bottom", el);
}
