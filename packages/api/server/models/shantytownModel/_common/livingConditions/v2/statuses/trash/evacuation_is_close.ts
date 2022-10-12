module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.trashEvacuationIsClose === true) {
        status.globalImpact = 'good';
    } else if (town.trashEvacuationIsClose === false) {
        status.globalImpact = 'bad';
    } else {
        status.globalImpact = 'unknown';
    }

    return status;
};
