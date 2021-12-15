const getPermission = require('./getPermission');
const { fromGeoLevelToTableName } = require('#server/utils/geo');

module.exports = () => ({
    can(user) {
        return {
            do(feature, entity) {
                const permission = getPermission(user, feature, entity);
                if (permission === null) {
                    return null;
                }

                let level = permission.geographic_level;
                if (level === 'local') {
                    if (permission.is_writing === false && ['city', 'epci'].includes(user.organization.location.type)) {
                        level = 'departement';
                    } else {
                        level = user.organization.location.type;
                    }
                }

                if (level === 'nation') {
                    return {};
                }

                if (!user.organization.location[level]) {
                    return null;
                }

                const where = {
                    [level]: {
                        query: `${fromGeoLevelToTableName(level)}.code`,
                        value: [user.organization.location[level].code],
                    },
                };
                if (level === 'city') {
                    where[`${level}_arrondissement`] = {
                        query: `${fromGeoLevelToTableName(level)}.fk_main`,
                        value: [user.organization.location[level].code],
                    };
                }

                return where;
            },
        };
    },
});
