const createRow = require('../create_row');

module.exports = (shantytown) => {
    const labels = {
        good: 'Le ramassage des déchets est en place',
        toImprove: 'Le ramassage des déchets est en place mais à améliorer',
        bad: 'Le ramassage des déchets n\'est pas en place',
    };
    const { status } = shantytown.livingConditions.trash;

    return createRow([
        'Ramassage des déchets',
        labels[status] || 'Aucune information concernant le ramassage des déchets',
    ]);
};
