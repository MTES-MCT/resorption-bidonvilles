export default function computeSiteName(shantytown) {
    if (shantytown.name) {
        return shantytown.name.replace(/^["']/, "");
    }

    const parts = [
        shantytown.addressSimple || "",
        shantytown.city?.name || "",
        shantytown.departement?.code ? `(${shantytown.departement.code})` : "",
    ];

    return parts
        .filter((part) => part.trim() !== "")
        .join(" ")
        .trim();
}
