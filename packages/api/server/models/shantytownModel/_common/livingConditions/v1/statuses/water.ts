import continuousAccess from './water/continuousAccess';
import distance from './water/distance';
import everyoneHasAccess from './water/everyoneHasAccess';
import handWashAccess from './water/handWashAccess';
import potable from './water/potable';
import publicPoint from './water/publicPoint';
import roadsToCross from './water/roadsToCross';
import stagnantWater from './water/stagnantWater';
import computeStatus from './computeStatus';

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

export default (town) => {
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
