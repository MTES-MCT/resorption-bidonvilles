const createRow = require('../create_row');

module.exports = (shantytown) => {
    const labels = {
        good: 'Accès à des toilettes existant',
        toImprove: 'Accès à des toilettes existant mais à améliorer',
        bad: 'Pas d\'accès à des toilettes',
    };
    const { status } = shantytown.livingConditions.sanitary;

    return createRow([
        'Accès à des toilettes fonctionnelles',
        labels[status] || 'Aucune information concernant l\'accès aux toilettes',
    ]);
};
