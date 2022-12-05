export default (town) => {
    const status = {
        globalImpact: null,
        details: null,
    };

    if ([null, 'inconnu'].includes(town.waterAccessType)) {
        status.globalImpact = 'unknown';
    } else if (['robinet_connecte_au_reseau', 'autre'].includes(town.waterAccessType)) {
        status.globalImpact = 'good';
    } else {
        status.globalImpact = 'bad';
    }

    return status;
};
