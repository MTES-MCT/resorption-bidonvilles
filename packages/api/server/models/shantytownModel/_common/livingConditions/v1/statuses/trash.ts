import accumulation from './trash/accumulation';
import cansOnSite from './trash/cansOnSite';
import evacuationRegular from './trash/evacuationRegular';
import computeStatus from './computeStatus';

const criterias = {
    accumulation,
    cansOnSite,
    evacuationRegular,
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
        status: computeStatus(town.trashEvacuation, details),
        ...details,
    };
};
