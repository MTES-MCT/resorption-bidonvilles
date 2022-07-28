module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.waterAccessIsLocal !== true) {
        return status;
    }

    if (town.waterAccessIsUnequal === false) {
        status.globalImpact = 'good';
        status.details = 'positive';
    } else if (town.waterAccessIsUnequal === true) {
        status.globalImpact = 'toImprove';
        status.details = 'negative';
    } else {
        status.details = 'unknown';
    }

    return status;
};
