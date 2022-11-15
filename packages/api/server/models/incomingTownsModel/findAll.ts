import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import permissionUtils from '#server/utils/permission';
import getAddressSimpleOf from '#server/models/shantytownModel/_common/getAddressSimpleOf';
import getUsenameOf from '#server/models/shantytownModel/_common/getUsenameOf';
import stringifyWhereClause from '#server/models/_common/stringifyWhereClause';

const { where } = permissionUtils;

export default async (user, shantytownIds) => {
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
            address
        FROM shantytown_incoming_towns AS incoming
        LEFT JOIN shantytowns ON incoming.fk_incoming_town = shantytowns.shantytown_id
        LEFT JOIN cities ON shantytowns.fk_city = cities.code
        LEFT JOIN departements ON cities.fk_departement = departements.code
        LEFT JOIN epci ON cities.fk_epci = epci.code
        LEFT JOIN regions ON departements.fk_region = regions.code
        WHERE ${whereClauses.join(' AND ')}`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                ...replacements,
                ids: shantytownIds,
            },
        },
    );

    return raw.map((row: any) => ({
        shantytownId: row.shantytownId,
        id: row.incomingTownId,
        name: row.name,
        addressSimple: getAddressSimpleOf(row.address),
        usename: getUsenameOf(row),
    }));
};
