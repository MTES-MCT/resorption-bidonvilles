const { fromGeoLevelToTableName } = require('#server/utils/geo');

module.exports = (user, feature, where = []) => {
    const featureLevel = user.permissions.shantytown[feature].geographic_level;
    const userLevel = user.organization.location.type;

    if (featureLevel !== 'nation' && (featureLevel !== 'local' || userLevel !== 'nation')) {
        const level = featureLevel === 'local' ? userLevel : featureLevel;
        if (user.organization.location[level] === null) {
            return [];
        }

        const clauseGroup = {
            location: {
                query: `${fromGeoLevelToTableName(level)}.code`,
                value: user.organization.location[level].code,
            },
        };
        where.push(clauseGroup);

        if (level === 'city') {
            clauseGroup.location_main_city = {
                query: `${fromGeoLevelToTableName(level)}.fk_main`,
                value: user.organization.location[level].code,
            };
        }
    }

    return where;
};
