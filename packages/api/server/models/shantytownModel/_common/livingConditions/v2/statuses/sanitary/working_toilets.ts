module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.sanitaryAccessWorkingToilets === true) {
        status.globalImpact = 'good';
    } else if (town.sanitaryAccessWorkingToilets === false) {
        status.globalImpact = 'bad';
    } else {
        status.globalImpact = 'unknown';
    }

    return status;
};
