const getPermission = require('./getPermission');

module.exports = () => ({
    can(user) {
        return {
            do(feature, entity) {
                const permission = getPermission(user, feature, entity);
                if (permission === null) {
                    return null;
                }

                if (permission.allow_all === true) {
                    return {};
                }

                const clauseGroup = Object.keys(permission.allowed_on).reduce((acc, tableName) => {
                    if (permission.allowed_on[tableName] && permission.allowed_on[tableName].length > 0) {
                        let primaryKey = 'code';
                        if (tableName === 'shantytowns') {
                            primaryKey = 'shantytown_id';
                        } else if (tableName === 'plans') {
                            primaryKey = 'plan_id';
                        }

                        const where = {
                            [tableName]: {
                                query: `${tableName}.${primaryKey}`,
                                value: permission.allowed_on[tableName],
                            },
                        };

                        if (tableName === 'cities') {
                            where[`${tableName}_arrondissement`] = {
                                query: `${tableName}.fk_main`,
                                value: permission.allowed_on[tableName],
                            };
                        }

                        return {
                            ...acc,
                            ...where,
                        };
                    }

                    return acc;
                }, {});

                if (Object.keys(clauseGroup).length === 0) {
                    return null;
                }

                return clauseGroup;
            },
        };
    },
});
