const getBadgeLabel = (
    count,
    percentage,
    positiveLabel,
    emptyLabel,
    percentageOnly = null
) => {
    if (count > 0) {
        if (percentageOnly) {
            return `${percentage}%`;
        }
        return `(${percentage}%) ${positiveLabel}`;
    }

    return emptyLabel;
};

export default getBadgeLabel;
