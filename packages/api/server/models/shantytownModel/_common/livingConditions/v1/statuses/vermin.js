const computeStatus = require('./computeStatus');

const INVERTED = true;

module.exports = (town) => {
    const details = {
        positive: [],
        negative: [],
        unknown: [],
    };

    return {
        status: computeStatus(town.vermin, details, INVERTED),
        ...details,
    };
};
