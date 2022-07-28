module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if ((typeof town.waterAccessIsPublic) !== 'boolean') {
        return status;
    }

    if (town.waterAccessIsLocal === true) {
        status.globalImpact = 'good';
        status.details = 'positive';
    } else if (town.waterAccessIsLocal === false) {
        status.globalImpact = 'bad';
        status.details = 'negative';
    } else {
        status.globalImpact = 'unknown';
        status.details = 'unknown';
    }

    return status;
};
