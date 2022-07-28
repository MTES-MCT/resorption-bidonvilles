const computeStatus = require('./computeStatus');

module.exports = (town) => {
    const details = {
        positive: [],
        negative: [],
        unknown: [],
    };

    const electricityLabel = town.electricityTypeLabel;
    let electricityValue = null;
    if (electricityLabel.startsWith('Oui')) {
        electricityValue = true;
    } else if (electricityLabel === 'Non') {
        electricityValue = false;
    }

    return {
        status: computeStatus(electricityValue, details),
        ...details,
    };
};
