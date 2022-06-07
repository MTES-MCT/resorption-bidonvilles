module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if ((typeof town.waterAccessIsPublic) !== 'boolean') {
        return status;
    }

    if (town.waterAccessIsContinuous === true) {
        status.globalImpact = 'good';
        status.details = 'positive';
    } else if (town.waterAccessIsContinuous === false) {
        status.globalImpact = 'toImprove';
        status.details = 'negative';
    } else {
        status.details = 'unknown';
    }

    return status;
};
