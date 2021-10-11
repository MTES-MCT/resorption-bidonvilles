const { sequelize } = require('#db/models');
const updateWhereClauseWithUserLocation = require('./_common/updateWhereClauseWithUserLocation');
const stringifyWhereClause = require('./_common/stringifyWhereClause');
const getUsenameOf = require('./_common/getUsenameOf');

module.exports = async (user, latitude, longitude, distance) => {
    const replacements = {};
    const locationWhere = updateWhereClauseWithUserLocation(user, 'list');
    const locationWhereClause = stringifyWhereClause(locationWhere, replacements);

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
    LEFT JOIN cities on shantytowns.fk_city = cities.code
    LEFT JOIN epci on cities.fk_epci = epci.code
    LEFT JOIN departements on cities.fk_departement = departements.code
    LEFT JOIN regions on departements.fk_region = regions.code
    WHERE 
        ${distanceCalc} < :distanceRadius
        AND closed_at is NULL
        ${locationWhereClause ? `AND ${locationWhereClause}` : ''}
    ORDER BY distance ASC
    `,
    {
        type: sequelize.QueryTypes.SELECT,
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
