export function skipFocus(el, direction, originNode, allowTop = true) {
    // soi-même
    if (tryFocus(el)) {
        return true;
    }

    // ensuite les enfants (et leurs descendants)
    if (originNode.parentNode !== el && el.childNodes?.length > 0) {
        const child =
            direction === "bottom"
                ? el.childNodes[0]
                : el.childNodes[el.childNodes.length - 1];
        if (skipFocus(child, direction, el, false)) {
            return true;
        }
    }

    // ensuite les frères
    const sibling =
        direction === "bottom"
            ? el.nextElementSibling
            : el.previousElementSibling;
    if (sibling) {
        return skipFocus(sibling, direction, el, allowTop);
    }

    // et enfin le parent
    if (allowTop && el.parentNode) {
        return skipFocus(el.parentNode, direction, el, allowTop);
    }

    return false;
}

function tryFocus(el) {
    if (
        (["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT", "DETAILS"].includes(
            el.nodeName
        ) ||
            el.tabIndex > -1) &&
        !el.disabled &&
        !el.hidden &&
        el.focus
    ) {
        el.focus();
        return true;
    }

    return false;
}
