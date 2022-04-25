const lifeCondition = require('./lifeCondition');

module.exports = (shantytown) => {
    let text;
    if (shantytown.vermin === true) {
        text = 'Des nuisibles sont présents sur le site';
    } else if (shantytown.vermin === false) {
        text = 'Il n\'y a pas de nuisibles sur le site';
    } else {
        text = 'Aucune information concernant la présence de nuisibles';
    }

    if (shantytown.verminComments) {
        text = `${text} – ${shantytown.verminComments}`;
    }

    return lifeCondition('Présence nuisibles', text);
};
