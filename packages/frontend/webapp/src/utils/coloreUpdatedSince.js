import getSince from "@/utils/getSince";

export default function (lastUpdatedAt) {
    let bgColor = "bg-green";
    const { months } = getSince(lastUpdatedAt);

    if (months >= 6) {
        bgColor = "bg-red600";
    }
    if (months >= 3 && months < 6) {
        bgColor = "bg-warningOrange";
    }
    return bgColor;
}
