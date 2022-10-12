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

        // ugly patch for shantytown_justice.access.allow_all qui doit avoir la même valeur que
        // shantytown.list.allow_all
        // la vue user_actual_permissions default shantytown_justice.access.allow_all à false
        if (row.entity === 'shantytown'
            && row.feature === 'list'
            && acc[row.user_id].shantytown_justice
            && acc[row.user_id].shantytown_justice.access
            && acc[row.user_id].shantytown_justice.access.allowed === true) {
            acc[row.user_id].shantytown_justice.access.allow_all = permission.allow_all;
            acc[row.user_id].shantytown_justice.access.allowed_on = permission.allowed_on;
        } else if (row.entity === 'shantytown_justice'
            && row.feature === 'access'
            && row.allowed === true
            && acc[row.user_id].shantytown
            && acc[row.user_id].shantytown.list) {
            permission.allow_all = acc[row.user_id].shantytown.list.allow_all;
            permission.allowed_on = acc[row.user_id].shantytown.list.allowed_on;
        }

        acc[row.user_id][row.entity][row.feature] = permission;
        return acc;
    }, {});
};
