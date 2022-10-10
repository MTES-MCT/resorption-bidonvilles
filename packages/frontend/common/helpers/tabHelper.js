let tab = null;

export function open(url) {
    if (tab === null || tab.closed) {
        tab = window.open(url, "_blank");
    } else {
        tab.location.assign(url);
        tab.focus();
    }
}

export default open;
