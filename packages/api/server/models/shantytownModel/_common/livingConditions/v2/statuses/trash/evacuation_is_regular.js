module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.trashEvacuationIsClose !== true) {
        return status;
    }

    if (town.trashEvacuationIsRegular === false) {
        status.globalImpact = 'toImprove';
        status.details = 'negative';
    } else if (town.trashEvacuationIsRegular === true) {
        status.globalImpact = 'good';
        status.details = 'positive';
    } else {
        status.details = 'unknown';
    }

    return status;
};
