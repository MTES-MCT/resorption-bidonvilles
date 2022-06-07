module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.pestAnimals === false) {
        status.globalImpact = 'good';
    } else if (town.pestAnimals === true) {
        status.globalImpact = 'bad';
    } else {
        status.globalImpact = 'unknown';
    }

    return status;
};
