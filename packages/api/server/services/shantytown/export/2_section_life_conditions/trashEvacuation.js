const lifeCondition = require('./lifeCondition');

module.exports = (shantytown) => {
    let text;
    if (shantytown.trashEvacuation === true) {
        text = 'Un ramassage des déchets organisé';
    } else if (shantytown.trashEvacuation === false) {
        text = 'Il n\'y a pas de ramassage des déchets organisé';
    } else {
        text = 'Aucune information concernant le ramassage des déchets';
    }

    return lifeCondition('Gestion déchets', text);
};
