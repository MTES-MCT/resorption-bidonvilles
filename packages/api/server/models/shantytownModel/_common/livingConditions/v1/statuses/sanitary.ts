import insalubrious from './sanitary/insalubrious';
import number from './sanitary/number';
import onSite from './sanitary/onSite';
import computeStatus from './computeStatus';

const criterias = {
    insalubrious,
    number,
    onSite,
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
        status: computeStatus(town.accessToSanitary, details),
        ...details,
    };
};
