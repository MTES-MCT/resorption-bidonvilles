module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.toiletTypes.length === 0 || (town.toiletTypes.length === 1 && town.toiletTypes.includes('latrines'))) {
        return status;
    }

    if (town.sanitaryAccessToiletsAreInside === true) {
        status.globalImpact = 'good';
        status.details = 'positive';
    } else if (town.sanitaryAccessToiletsAreInside === false) {
        status.globalImpact = 'bad';
        status.details = 'negative';
    } else {
        status.globalImpact = 'unkown';
        status.details = 'unknown';
    }

    return status;
};
