module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.firePrevention === false) {
        status.globalImpact = 'bad';
    } else if (town.firePrevention === true) {
        status.globalImpact = 'good';
    } else {
        status.globalImpact = 'unknown';
    }

    return status;
};
