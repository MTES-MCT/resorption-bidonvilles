module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.sanitaryAccessWorkingToilets !== true) {
        return status;
    }

    if (town.toiletTypes === undefined || town.toiletTypes.length === 0) {
        status.globalImpact = 'unknown';
        status.details = 'unknown';
    } else if (!town.toiletTypes.includes('latrines')) {
        status.globalImpact = 'good';
        status.details = 'positive';
    } else if (town.toiletTypes.length >= 2) {
        status.globalImpact = 'toImprove';
        status.details = 'negative';
    } else {
        status.globalImpact = 'bad';
        status.details = 'negative';
    }

    return status;
};
