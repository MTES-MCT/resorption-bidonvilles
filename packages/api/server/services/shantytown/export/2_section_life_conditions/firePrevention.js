const createRow = require('../create_row');

module.exports = (shantytown) => {
    let text;
    if (shantytown.firePrevention === true) {
        text = 'Des mesures de prévention anti-incendie sont en place';
    } else if (shantytown.firePrevention === false) {
        text = 'Il n\'y a pas encore de mesures de prévention anti-incendie';
    } else {
        text = 'Aucune information concernant la présence de mesures de prévention anti-incendie';
    }

    if (shantytown.firePreventionComments) {
        text = `${text} – ${shantytown.firePreventionComments}`;
    }

    return createRow(['Prévention incendie', text]);
};
