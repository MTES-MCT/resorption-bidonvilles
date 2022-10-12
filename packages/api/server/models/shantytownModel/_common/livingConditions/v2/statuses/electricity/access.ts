module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.electricityAccess === false) {
        status.globalImpact = 'bad';
    } else if (town.electricityAccess === true) {
        status.globalImpact = 'good';
    } else {
        status.globalImpact = 'unknown';
    }

    return status;
};
