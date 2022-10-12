module.exports = (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if (['robinet_connecte_au_reseau', 'autre'].includes(town.waterAccessType)) {
        status.globalImpact = 'good';
    } else {
        status.globalImpact = 'bad';
    }

    return status;
};
