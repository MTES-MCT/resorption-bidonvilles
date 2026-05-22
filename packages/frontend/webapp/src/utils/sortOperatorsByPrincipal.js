const sortOperatorsByPrincipal = (operators) => {
    if (!operators || operators.length === 0) {
        return [];
    }

    const sorted = [...operators];

    sorted.sort((a, b) => {
        const aHasPrincipal = a.users?.some((u) => u.is_principal === true);
        const bHasPrincipal = b.users?.some((u) => u.is_principal === true);

        if (aHasPrincipal && !bHasPrincipal) {
            return -1;
        }
        if (!aHasPrincipal && bHasPrincipal) {
            return 1;
        }

        return 0;
    });

    return sorted;
};

export default sortOperatorsByPrincipal;
