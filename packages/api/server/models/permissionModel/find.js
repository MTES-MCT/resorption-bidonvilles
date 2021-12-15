const { sequelize } = require('#db/models');

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
            uap.allowed,
            uap.is_writing,
            uap.fk_geographic_level AS geographic_level
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
            allowed: row.allowed,
            geographic_level: row.geographic_level,
            is_writing: row.is_writing,
        };

        acc[row.user_id][row.entity][row.feature] = permission;
        return acc;
    }, {});
};
