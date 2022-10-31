import computeStatus from './computeStatus';

const INVERTED = true;

export default (town) => {
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
