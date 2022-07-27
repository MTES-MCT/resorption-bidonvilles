const createRow = require('../create_row');

module.exports = (shantytown) => {
    const labels = {
        good: 'Diagnostic réalisé par le SDIS',
        toImprove: 'Diagnostic non réalisé',
        bad: 'Diagnostic non réalisé',
    };
    const { status } = shantytown.livingConditions.fire_prevention;

    return createRow([
        'Diagnostic prévention incendie',
        labels[status] || 'Aucune information concernant le diagnostic',
    ]);
};
