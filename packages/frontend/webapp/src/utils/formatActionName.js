import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";

export const formatOperatorName = (action) => {
    if (!action) {
        return "";
    }

    if (action.operator_name) {
        return capitalizeFirstLetter(action.operator_name);
    }

    if (action.name) {
        const parts = action.name.split(" - ");
        if (parts.length === 2) {
            return capitalizeFirstLetter(parts[0].trim());
        }
    }

    return "";
};

export const formatProjectName = (action) => {
    if (!action) {
        return "";
    }

    if (action.project_name) {
        return capitalizeFirstLetter(action.project_name);
    }

    if (action.name) {
        const parts = action.name.split(" - ");
        if (parts.length === 2) {
            return capitalizeFirstLetter(parts[1].trim());
        }
        return capitalizeFirstLetter(action.name);
    }

    return "";
};

const formatActionName = (action) => {
    const operatorName = formatOperatorName(action);
    const projectName = formatProjectName(action);

    if (operatorName && projectName) {
        return `${operatorName} - ${projectName}`;
    }

    return projectName || operatorName || "";
};

export default formatActionName;
