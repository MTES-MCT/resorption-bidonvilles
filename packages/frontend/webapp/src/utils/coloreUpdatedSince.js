import getSince from "@/utils/getSince";

export default function (updatedAt, lastUpdatedAt) {
    let bgColor = "bg-green";

    const { months } = getSince(lastUpdatedAt);
    const { months: monthsUpdate } = getSince(updatedAt);

    if (monthsUpdate >= 6) {
        bgColor = "bg-red600";
    }
    if (monthsUpdate >= 3 && monthsUpdate < 6 && months >= 3 && months < 6) {
        bgColor = "bg-warningOrange";
    }
    return bgColor;
}
