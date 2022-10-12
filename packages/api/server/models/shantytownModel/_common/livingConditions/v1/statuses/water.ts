const continuousAccess = require('./water/continuousAccess');
const distance = require('./water/distance');
const everyoneHasAccess = require('./water/everyoneHasAccess');
const handWashAccess = require('./water/handWashAccess');
const potable = require('./water/potable');
const publicPoint = require('./water/publicPoint');
const roadsToCross = require('./water/roadsToCross');
const stagnantWater = require('./water/stagnantWater');
const computeStatus = require('./computeStatus');

const criterias = {
    continuousAccess,
    distance,
    everyoneHasAccess,
    handWashAccess,
    potable,
    publicPoint,
    roadsToCross,
    stagnantWater,
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
        status: computeStatus(town.accessToWater, details),
        ...details,
    };
};
