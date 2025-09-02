import getSince from "@/utils/getSince";

export default function (updatedAt, lastUpdatedAt) {
    let badgeType = "success";

    const { months } = getSince(lastUpdatedAt);
    const { months: monthsSinceLastUpdate } = getSince(updatedAt);

    if (monthsSinceLastUpdate >= 6) {
        badgeType = "error";
    }
    if (
        monthsSinceLastUpdate >= 3 &&
        monthsSinceLastUpdate < 6 &&
        months >= 3 &&
        months < 6
    ) {
        badgeType = "warning";
    }
    return badgeType;
}
