export default function (blob, name = "file") {
    const url = window.URL.createObjectURL(blob);
    const hiddenElement = document.createElement("a");
    hiddenElement.href = url;
    hiddenElement.target = "_blank";
    hiddenElement.download = name;
    hiddenElement.click();
}
