const STATUS_PRIORITY = ['bad', 'unknown', 'toImprove'];

module.exports = (town, items) => {
    const {
        status, positive, negative, unknown,
    } = Object.keys(items).reduce((argAcc, itemKey) => {
        const { globalImpact, details } = items[itemKey](town);

        const acc = { ...argAcc };
        if (globalImpact !== null) {
            acc.status.push(globalImpact);
        }
        if (details !== null) {
            acc[details].push(itemKey);
        }

        return acc;
    }, {
        status: [],
        positive: [],
        negative: [],
        unknown: [],
    });

    return {
        status: STATUS_PRIORITY.find(s => status.includes(s)) || 'good',
        positive,
        negative,
        unknown,
    };
};
