module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.sanitaryAccessOpenAirDefecation === true) {
        status.globalImpact = 'toImprove';
        status.details = 'negative';
    } else if (town.sanitaryAccessOpenAirDefecation === false) {
        status.globalImpact = 'good';
        status.details = 'positive';
    } else {
        status.details = 'unknown';
    }

    return status;
};
