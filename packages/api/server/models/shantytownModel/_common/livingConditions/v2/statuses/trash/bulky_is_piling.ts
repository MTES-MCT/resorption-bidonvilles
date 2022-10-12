module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (town.trashEvacuationIsClose !== true) {
        return status;
    }

    if (town.trashBulkyIsPiling === true) {
        status.globalImpact = 'toImprove';
        status.details = 'negative';
    } else if (town.trashBulkyIsPiling === false) {
        status.globalImpact = 'good';
        status.details = 'positive';
    } else {
        status.details = 'unknown';
    }

    return status;
};
