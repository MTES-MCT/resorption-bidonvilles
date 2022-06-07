module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.electricityAccess !== true) {
        return status;
    }

    if (town.electricityAccessTypes.length === 0) {
        status.details = 'unknown';
    }

    return status;
};
