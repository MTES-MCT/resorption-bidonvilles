let tab = null;

export function open(url) {
    if (tab === null || tab.closed) {
        tab = window.open(url, '_blank');
    } else {
        tab.location = url;
        tab.location.reload();
        tab.focus();
    }
}

export default open;
