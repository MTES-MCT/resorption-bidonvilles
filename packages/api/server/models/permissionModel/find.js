const sequelize = require('#db/sequelize');

/**
 * @param {Array.<Number>} owners User ids
 *
 * @returns {Object}
 */
module.exports = async (owners) => {
    const permissions = await sequelize.query(`
        SELECT
            uap.user_id,
            uap.fk_entity AS entity,
            uap.fk_feature AS feature,
            uap.is_writing,
            uap.allowed,
            uap.allow_all,
            uap.regions,
            uap.departements,
            uap.epci,
            uap.cities,
            uap.shantytowns,
            uap.plans
        FROM user_actual_permissions uap
        WHERE uap.user_id IN (:owners)
        ORDER BY user_id ASC, entity ASC, feature ASC
    `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            owners,
        },
    });

    return permissions.reduce((argAcc, row) => {
        const acc = { ...argAcc };
        if (!acc[row.user_id]) {
            acc[row.user_id] = {};
        }

        if (!acc[row.user_id][row.entity]) {
            acc[row.user_id][row.entity] = {};
        }

        const permission = {
            is_writing: row.is_writing,
            allowed: row.allowed,
            allow_all: row.allow_all === true,
            allowed_on: row.allow_all === false ? {
                regions: row.regions || [],
                departements: row.departements || [],
                epci: row.epci || [],
                cities: row.cities || [],
                shantytowns: row.shantytowns || [],
                plans: row.plans || [],
            } : null,
        };

        acc[row.user_id][row.entity][row.feature] = permission;
        return acc;
    }, {});
};
