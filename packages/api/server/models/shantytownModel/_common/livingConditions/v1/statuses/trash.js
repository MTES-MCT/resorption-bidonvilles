const accumulation = require('./trash/accumulation');
const cansOnSite = require('./trash/cansOnSite');
const evacuationRegular = require('./trash/evacuationRegular');
const computeStatus = require('./computeStatus');

const criterias = {
    accumulation,
    cansOnSite,
    evacuationRegular,
};

module.exports = (town) => {
    const details = Object.keys(criterias).reduce((argAcc, key) => {
        const acc = { ...argAcc };
        const status = criterias[key](town);

        if (status === true) {
            acc.positive.push(key);
        } else if (status === false) {
            acc.negative.push(key);
        } else {
            acc.unknown.push(key);
        }

        return acc;
    }, {
        positive: [],
        negative: [],
        unknown: [],
    });

    return {
        status: computeStatus(town.trashEvacuation, details),
        ...details,
    };
};
