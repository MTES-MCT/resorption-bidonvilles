const lifeCondition = require('./lifeCondition');

module.exports = (shantytown) => {
    let text;
    if (shantytown.accessToSanitary === true) {
        text = 'Accès aux toilettes existant';
    } else if (shantytown.accessToSanitary === false) {
        text = 'Accès aux toilettes inexistant';
    } else {
        text = 'Aucune information concernant l\'accès aux toilettes';
    }

    if (shantytown.sanitaryComments) {
        text = `${text} – ${shantytown.sanitaryComments}`;
    }

    return lifeCondition('Accès toilettes', text);
};
