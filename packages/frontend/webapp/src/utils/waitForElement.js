export default function waitForElement(selector, callback, starter = null) {
    if (starter === null) {
        starter = Date.now();
    }

    if ((Date.now() - starter) / 1000 >= 15) {
        throw new Error(`Never found element ${selector}`);
    }

    const el = document.querySelector(selector);
    if (!el) {
        requestAnimationFrame(
            waitForElement.bind(this, selector, callback, starter)
        );
    } else {
        callback(el);
    }
}
