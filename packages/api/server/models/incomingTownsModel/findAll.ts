import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import permissionUtils from '#server/utils/permission';
import getAddressSimpleOf from '#server/models/shantytownModel/_common/getAddressSimpleOf';
import getUsenameOf from '#server/models/shantytownModel/_common/getUsenameOf';
import stringifyWhereClause from '#server/models/_common/stringifyWhereClause';
import validateSafeWhereClause from '#server/models/_common/validateSafeWhereClause';

const { where } = permissionUtils;

type IncomingTownRow = {
    shantytownId: number,
    incomingTownId: number,
    name: string,
    address: string,
    usename: string,
    cityCode: string,
    cityName: string,
    fieldTypeLabel: string,
    fieldTypeColor: string
};

export type IncomingTown = {
    shantytownId: number,
    id: number,
    name: string,
    addressSimple: string,
    usename: string,
    city: {
        code:string,
        name: string,
    },
    fieldType: {
        label: string,
        color: string,
    },
};

export default async (user, shantytownIds): Promise<IncomingTown[]> => {
    const clauseGroup = where().can(user).do('list', 'shantytown');
    if (clauseGroup === null) {
        return [];
    }

    const replacements = {};
    const whereClauses = ['incoming.fk_shantytown IN (:ids)'];
    if (Object.keys(clauseGroup).length > 0) {
        const permissionWhereClause = stringifyWhereClause('shantytowns', [clauseGroup], replacements);
        validateSafeWhereClause(permissionWhereClause);
        whereClauses.push(permissionWhereClause);
    }

    const raw: IncomingTownRow[] = await sequelize.query(
        `SELECT
            incoming.fk_shantytown AS "shantytownId",
            incoming.fk_incoming_town AS "incomingTownId",
            shantytowns.name AS "name",
            address,
            cities.code AS "cityCode",
            cities.name AS "cityName",
            field_types.label AS "fieldTypeLabel",
            field_types.color AS "fieldTypeColor"
        FROM shantytown_incoming_towns AS incoming
        LEFT JOIN shantytowns ON incoming.fk_incoming_town = shantytowns.shantytown_id
        LEFT JOIN cities ON shantytowns.fk_city = cities.code
        LEFT JOIN departements ON cities.fk_departement = departements.code
        LEFT JOIN epci ON cities.fk_epci = epci.code
        LEFT JOIN regions ON departements.fk_region = regions.code
        LEFT JOIN field_types ON shantytowns.fk_field_type = field_types.field_type_id
        WHERE ${whereClauses.join(' AND ')}`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                ...replacements,
                ids: shantytownIds,
            },
        },
    );

    return raw.map((row: IncomingTownRow) => ({
        shantytownId: row.shantytownId,
        id: row.incomingTownId,
        name: row.name,
        addressSimple: getAddressSimpleOf(row.address),
        usename: getUsenameOf(row),
        city: {
            code: row.cityCode,
            name: row.cityName,
        },
        fieldType: {
            label: row.fieldTypeLabel,
            color: row.fieldTypeColor,
        },
    }));
};
