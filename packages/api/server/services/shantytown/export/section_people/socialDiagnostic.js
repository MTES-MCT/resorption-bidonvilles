const formatDate = require('../../_common/formatDate');

module.exports = (town) => {
    if (town.censusStatus === 'done') {
        return `Réalisé le ${formatDate(
            town.censusConductedAt,
            'DD MMMM YYYY',
        )} par ${town.censusConductedBy}`;
    }

    if (town.censusStatus === 'scheduled') {
        return `Prévu le ${formatDate(
            town.censusConductedAt,
            'DD MMMM YYYY',
        )} par ${town.censusConductedBy}`;
    }

    if (town.censusStatus === 'none') {
        return 'Non réalisé';
    }

    return 'Non communiqué';
};
