import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import stringifyWhereClause from '#server/models/_common/stringifyWhereClause';
import permissionUtils from '#server/utils/permission';
import getUsenameOf from './_common/getUsenameOf';

const { where } = permissionUtils;

export default async (user, latitude, longitude, distance, closed = false) => {
    const replacements = {};
    const permissionClauseGroup = where().can(user).do('list', 'shantytown');
    if (permissionClauseGroup === null) {
        return [];
    }

    let locationWhereClause = null;
    if (Object.keys(permissionClauseGroup).length > 0) {
        locationWhereClause = stringifyWhereClause(
            'shantytowns',
            [permissionClauseGroup],
            replacements,
        );
    }

    const distanceCalc = '(6371 * 2 * ASIN(SQRT( POWER(SIN(( :latitude - shantytowns.latitude) *  pi()/180 / 2), 2) +COS( :latitude * pi()/180) * COS(shantytowns.latitude * pi()/180) * POWER(SIN(( :longitude - shantytowns.longitude) * pi()/180 / 2), 2) )))';

    const result = await sequelize.query(`
    SELECT 
        shantytowns.shantytown_id,
        shantytowns.name,
        shantytowns.closed_at,
        shantytowns.latitude,
        shantytowns.longitude,
        shantytowns.address,
        shantytowns.access_to_water,
        ${distanceCalc} as distance,
        (SELECT regexp_matches(shantytowns.address, '^(.+) [0-9]+ [^,]+,? [0-9]+,? [^, ]+(,.+)?$'))[1] as address_simple
    FROM shantytowns
    LEFT JOIN cities ON shantytowns.fk_city = cities.code
    LEFT JOIN epci ON cities.fk_epci = epci.code
    LEFT JOIN departements ON cities.fk_departement = departements.code
    LEFT JOIN regions ON departements.fk_region = regions.code
    WHERE 
        ${distanceCalc} < :distanceRadius
        AND closed_at is ${closed ? 'NOT' : ''} NULL
        ${locationWhereClause ? `AND ${locationWhereClause}` : ''}
    ORDER BY distance ASC
    `,
    {
        type: QueryTypes.SELECT,
        replacements: {
            ...replacements, latitude, longitude, distanceRadius: distance,
        },
    });

    return result.map((r) => {
        const town = {
            id: r.shantytown_id,
            name: r.name,
            closedAt: r.closed_at !== null ? (r.closed_at.getTime() / 1000) : null,
            latitude: r.latitude,
            longitude: r.longitude,
            address: r.address,
            addressSimple: r.address_simple,
            accessToWater: r.access_to_water,
            distance: r.distance,
        };

        return { ...town, usename: getUsenameOf(town) };
    });
};
