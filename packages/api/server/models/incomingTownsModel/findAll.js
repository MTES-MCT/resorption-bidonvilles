const sequelize = require('#db/sequelize');
const { where } = require('#server/utils/permission');
const addressSimpleRegex = require('#server/models/shantytownModel/_common/addressSimpleRegex');
const getAddressSimpleOf = require('#server/models/shantytownModel/_common/getAddressSimpleOf');
const getUsenameOf = require('#server/models/shantytownModel/_common/getUsenameOf');
const stringifyWhereClause = require('#server/models/_common/stringifyWhereClause');

module.exports = async (user, shantytownIds) => {
    const clauseGroup = where().can(user).do('list', 'shantytown');
    if (clauseGroup === null) {
        return [];
    }

    const replacements = {};
    const whereClauses = ['incoming.fk_shantytown IN (:ids)'];
    if (Object.keys(clauseGroup).length > 0) {
        whereClauses.push(stringifyWhereClause('shantytowns', [clauseGroup], replacements));
    }

    const raw = await sequelize.query(
        `SELECT
            incoming.fk_shantytown AS "shantytownId",
            incoming.fk_incoming_town AS "incomingTownId",
            shantytowns.name AS "name",
            ${addressSimpleRegex} AS "addressSimple"
        FROM shantytown_incoming_towns AS incoming
        LEFT JOIN shantytowns ON incoming.fk_incoming_town = shantytowns.shantytown_id
        LEFT JOIN cities ON shantytowns.fk_city = cities.code
        LEFT JOIN departements ON cities.fk_departement = departements.code
        LEFT JOIN epci ON cities.fk_epci = epci.code
        LEFT JOIN regions ON departements.fk_region = regions.code
        WHERE ${whereClauses.join(' AND ')}`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                ...replacements,
                ids: shantytownIds,
            },
        },
    );

    return raw.map(row => ({
        shantytownId: row.shantytownId,
        id: row.incomingTownId,
        name: row.name,
        addressSimple: getAddressSimpleOf(row),
        usename: getUsenameOf(row),
    }));
};
