const lifeCondition = require('./lifeCondition');

module.exports = (shantytown) => {
    let text;
    if (shantytown.waterAccessConditions === 'true') {
        text = 'Accès à l\'eau existant';
    } else if (shantytown.waterAccessConditions === 'toImprove') {
        text = 'Accès à l\'eau à améliorer';
    } else {
        text = 'Accès à l\'eau inexistant (ou inconnu)';
    }

    if (shantytown.waterComments) {
        text = `${text} – ${shantytown.waterComments}`;
    }

    return lifeCondition('Accès eau', text);
};
