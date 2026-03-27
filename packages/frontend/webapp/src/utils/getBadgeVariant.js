const getBadgeVariant = (value, successThreshold, warningThreshold) => {
    if (value >= successThreshold) {
        return "success";
    }

    if (value >= warningThreshold) {
        return "warning";
    }

    return "error";
};

export default getBadgeVariant;
