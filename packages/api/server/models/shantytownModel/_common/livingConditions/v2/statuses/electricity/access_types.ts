export default (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.electricityAccess !== true) {
        return status;
    }

    if (town.electricityAccessTypes === undefined || town.electricityAccessTypes.length === 0) {
        status.details = 'unknown';
    }

    return status;
};
