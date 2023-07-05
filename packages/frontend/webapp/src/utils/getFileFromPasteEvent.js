export default (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData)
        .items;
    for (let index in items) {
        const item = items[index];
        if (item.kind === "file") {
            return item.getAsFile();
        }
    }
};
