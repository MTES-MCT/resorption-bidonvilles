export default function (blob, name = "file", options = {}) {
    const url = window.URL.createObjectURL(blob, options);
    const hiddenElement = document.createElement("a");
    hiddenElement.href = url;
    hiddenElement.target = "_blank";
    hiddenElement.download = name;
    hiddenElement.click();
}
