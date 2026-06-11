import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";

const formatUserWithOrganization = (label) => {
    if (!label) {
        return "";
    }

    // Format attendu : "Prénom Nom (Organisation)". On localise la dernière
    // parenthèse ouvrante et la parenthèse fermante de fin pour découper
    // sans regex (évite tout risque ReDoS et reste robuste si le nom de
    // l'utilisateur contient lui-même des parenthèses).
    const openParenIndex = label.lastIndexOf("(");
    const closeParenIndex = label.length - 1;

    if (
        openParenIndex === -1 ||
        label[closeParenIndex] !== ")" ||
        openParenIndex >= closeParenIndex
    ) {
        return label;
    }

    const userName = label.slice(0, openParenIndex).trim();
    const organizationName = label
        .slice(openParenIndex + 1, closeParenIndex)
        .trim();

    return `${capitalizeFirstLetter(organizationName)} - ${userName}`;
};

export default formatUserWithOrganization;
