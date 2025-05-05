import getSince from "@/utils/getSince";

export default function (updatedAt, lastUpdatedAt) {
    let bgColor = "bg-green";

    const { months } = getSince(lastUpdatedAt);
    const { months: monthsSinceLastUpdate } = getSince(updatedAt);

    if (monthsSinceLastUpdate >= 6) {
        bgColor = "bg-red600";
    }
    if (
        monthsSinceLastUpdate >= 3 &&
        monthsSinceLastUpdate < 6 &&
        months >= 3 &&
        months < 6
    ) {
        bgColor = "bg-warningOrange";
    }
    return bgColor;
}
