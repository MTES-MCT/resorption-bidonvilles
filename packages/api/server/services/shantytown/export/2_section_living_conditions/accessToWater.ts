const createRow = require('../create_row');

module.exports = (shantytown) => {
    const labels = {
        good: 'Accès à l\'eau existant',
        toImprove: 'Accès à l\'eau existant mais à améliorer',
        bad: 'Accès à l\'eau inexistant',
    };
    const { status, access_comments: comments } = shantytown.livingConditions.water;

    const access_types = {
        fontaine_publique: 'Fontaine publique',
        borne_incendie: 'Borne incendie',
        achat_bouteille: 'Achat bouteille uniquement',
        reservoir: 'Réservoir / Cuve / Citerne',
        robinet_connecte_au_reseau: 'Robinet connecté au réseau d\'eau',
        autre: 'Autre',
        inconnu: 'Inconnu',
    };

    const access_type = access_types[shantytown.livingConditions.water.access_type];

    let text = labels[status.status] || 'Aucune information concernant l\'accès à l\'eau';
    if (comments) {
        text = `${text} - ${access_type}\n${comments}`;
    }

    return createRow(['Accès à l\'eau', text]);
};
