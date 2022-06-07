module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.electricityAccess !== true) {
        return status;
    }

    if (town.electricityAccessIsUnequal === true) {
        status.globalImpact = 'toImprove';
        status.details = 'negative';
    }

    return status;
};
