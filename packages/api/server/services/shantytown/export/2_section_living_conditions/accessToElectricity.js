const createRow = require('../create_row');

module.exports = (shantytown) => {
    const labels = {
        good: 'Accès à l\'électricité existant',
        toImprove: 'Accès à l\'électricité existant mais à améliorer',
        bad: 'Accès à l\'électricité inexistant',
    };
    const { status } = shantytown.livingConditions.electricity;

    return createRow([
        'Accès à l\'électricité',
        labels[status.status] || 'Aucune information concernant l\'accès à l\'électricité',
    ]);
};
