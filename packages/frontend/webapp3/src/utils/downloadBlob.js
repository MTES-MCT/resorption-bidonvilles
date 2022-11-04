export default function (data, name = "file") {
    const url = window.URL.createObjectURL(new Blob([data]));
    const hiddenElement = document.createElement("a");
    hiddenElement.href = url;
    hiddenElement.target = "_blank";
    hiddenElement.download = name;
    hiddenElement.click();
}
