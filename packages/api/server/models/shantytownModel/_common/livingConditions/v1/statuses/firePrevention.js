const computeStatus = require('./computeStatus');

module.exports = (town) => {
    const unserializedKeys = {
        diagnostic: 'firePreventionDiagnostic',
        devices: 'firePreventionDevices',
        siteAccessible: 'firePreventionSiteAccessible',
    };

    const details = Object.keys(unserializedKeys).reduce((argAcc, serializedKey) => {
        const unserializedKey = unserializedKeys[serializedKey];
        const value = town[unserializedKey];

        const acc = { ...argAcc };
        if (value === null) {
            acc.unknown.push(serializedKey);
        } else if (value) {
            acc.positive.push(serializedKey);
        } else {
            acc.negative.push(serializedKey);
        }

        return acc;
    }, {
        positive: [],
        negative: [],
        unknown: [],
    });

    return {
        status: computeStatus(town.firePreventionMeasures, details),
        ...details,
    };
};
