const createRow = require('../create_row');

module.exports = (shantytown) => {
    const labels = {
        good: 'Absence de nuisibles',
        toImprove: 'Présence de nuisibles',
        bad: 'Présence de nuisibles',
    };
    const { status, details: comments } = shantytown.livingConditions.pest_animals;

    let text = labels[status.status] || 'Aucune information concernant la présence de nuisibles';
    if (comments) {
        text = `${text} – ${comments}`;
    }

    return createRow(['Nuisibles', text]);
};
