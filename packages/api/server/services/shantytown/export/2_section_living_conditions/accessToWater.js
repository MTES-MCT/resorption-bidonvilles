const createRow = require('../create_row');

module.exports = (shantytown) => {
    const labels = {
        good: 'Accès à l\'eau existant',
        toImprove: 'Accès à l\'eau existant mais à améliorer',
        bad: 'Accès à l\'eau inexistant',
    };
    const { status, access_comments: comments } = shantytown.livingConditions.water;

    let text = labels[status.status] || 'Aucune information concernant l\'accès à l\'eau';
    if (comments) {
        text = `${text} – ${comments}`;
    }

    return createRow(['Accès à l\'eau', text]);
};
