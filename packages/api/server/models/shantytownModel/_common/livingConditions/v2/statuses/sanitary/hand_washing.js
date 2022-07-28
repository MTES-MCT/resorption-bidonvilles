module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.toiletTypes.length === 0 || (town.toiletTypes.length === 1 && town.toiletTypes.includes('latrines'))) {
        return status;
    }

    if (town.sanitaryAccessHandWashing === true) {
        status.globalImpact = 'good';
        status.details = 'positive';
    } else if (town.sanitaryAccessHandWashing === false) {
        status.globalImpact = 'toImprove';
        status.details = 'negative';
    } else {
        status.details = 'unknown';
    }

    return status;
};
