export default function (content, name = "file.csv") {
    const hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(content);
    hiddenElement.target = "_blank";
    hiddenElement.download = name;
    hiddenElement.click();
}
