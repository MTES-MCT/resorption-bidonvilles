module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.waterAccessIsPublic === true) {
        status.globalImpact = 'bad';
        status.details = 'negative';
    } else if (town.waterAccessIsPublic === false) {
        status.globalImpact = 'good';
        status.details = 'positive';
    } else {
        status.globalImpact = 'unknown';
        status.details = 'unknown';
    }

    return status;
};
