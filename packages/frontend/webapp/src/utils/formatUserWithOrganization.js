const capitalizeFirstLetter = (str) => {
    if (!str) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatUserWithOrganization = (label) => {
    if (!label) {
        return "";
    }

    const match = label.match(/^([^(]+?)\s*\(([^)]+)\)$/);

    if (!match) {
        return label;
    }

    const userName = match[1].trim();
    const organizationName = match[2].trim();

    return `${capitalizeFirstLetter(organizationName)} - ${userName}`;
};

export default formatUserWithOrganization;
