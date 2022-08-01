const sequelize = require('#db/sequelize');
const stringifyWhereClause = require('#server/models/_common/stringifyWhereClause');
const { where } = require('#server/utils/permission');
const getUsenameOf = require('./_common/getUsenameOf');

module.exports = async (user, citycode, closed_since) => {
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

    const result = await sequelize.query(`
        SELECT
            shantytowns.shantytown_id,
            shantytowns.status,
            cities.name as city,
            shantytowns.closed_at,
            shantytowns.name,
            shantytowns.address,
            (SELECT regexp_matches(shantytowns.address, '^(.+) [0-9]+ [^,]+,? [0-9]+,? [^, ]+(,.+)?$'))[1] as address_simple,
            shantytowns.population_total
        FROM
            shantytowns
        LEFT JOIN
            cities ON shantytowns.fk_city = cities.code
        LEFT JOIN
            epci ON cities.fk_epci = epci.code
        LEFT JOIN
            departements ON cities.fk_departement = departements.code
        LEFT JOIN
            regions ON departements.fk_region = regions.code
        WHERE
            closed_at is NOT null
        AND
            departements.code = (SELECT fk_departement from cities where cities.code = :citycode)
        AND 
            (DATE_PART('day', :closed_since::timestamp - shantytowns.closed_at::timestamp)) > 0
        AND 
            (DATE_PART('day', :closed_since::timestamp - shantytowns.closed_at::timestamp)) <= 90
            ${locationWhereClause ? `AND ${locationWhereClause}` : ''}
        ORDER BY
            closed_at DESC
    `,
    {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            ...replacements, citycode, closed_since,
        },
    });

    return result.map((r) => {
        const town = {
            id: r.shantytown_id,
            status: r.status,
            city: r.city,
            closedAt: r.closed_at !== null ? (r.closed_at.getTime() / 1000) : null,
            name: r.name,
            address: r.address,
            address_simple: r.address_simple,
            populationTotal: r.population_total !== null ? r.population_total : null,
        };

        return { ...town, usename: getUsenameOf(town) };
    });
};
