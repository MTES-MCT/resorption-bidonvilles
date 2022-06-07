module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.waterAccessIsLocal !== true) {
        return status;
    }

    if (town.waterAccessHasStagnantWater === false) {
        status.globalImpact = 'good';
        status.details = 'positive';
    } else if (town.waterAccessHasStagnantWater === true) {
        status.globalImpact = 'toImprove';
        status.details = 'negative';
    } else {
        status.details = 'unknown';
    }

    return status;
};
