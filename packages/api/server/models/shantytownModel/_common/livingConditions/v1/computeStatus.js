module.exports = (mainValue, details, inverted = false) => {
    if (mainValue === null) {
        return 'unknown';
    }

    if (mainValue === false) {
        return inverted ? 'good' : 'bad';
    }

    if (details.negative.length > 0) {
        return 'toImprove';
    }

    return inverted ? 'bad' : 'good';
};
