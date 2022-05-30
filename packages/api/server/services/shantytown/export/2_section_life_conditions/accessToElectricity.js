const createRow = require('../create_row');

module.exports = (shantytown) => {
    let text;
    if (shantytown.electricityType.uid === 'oui') {
        text = 'Accès à l\'électricité existant';
    } else if (shantytown.electricityType.uid === 'non') {
        text = 'Accès à l\'électricité inexistant';
    } else {
        text = 'Aucune information concernant l\'accès à l\'électricité';
    }

    if (shantytown.electricityComments) {
        text = `${text} – ${shantytown.electricityComments}`;
    }

    return createRow(['Accès électricité', text]);
};
