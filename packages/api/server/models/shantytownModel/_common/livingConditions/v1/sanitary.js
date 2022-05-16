const insalubrious = require('./sanitary/insalubrious');
const number = require('./sanitary/number');
const onSite = require('./sanitary/onSite');
const computeStatus = require('./computeStatus');

const criterias = {
    insalubrious,
    number,
    onSite,
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
        status: computeStatus(town.accessToSanitary, details),
        ...details,
    };
};
