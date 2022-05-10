const sequelize = require('#db/sequelize');
const { restrict } = require('#server/utils/permission');
const { fromGeoLevelToTableName } = require('#server/utils/geo');
const decomposeForDiagramm = require('./_common/decomposeForDiagramm');
const getArrayOfDates = require('./_common/getArrayOfDates');

module.exports = async (user, location) => {
    const restrictedLocation = restrict(location).for(user).askingTo('list', 'shantytown');
    if (restrictedLocation === null) {
        return null;
    }

    let where = '';
    switch (location.type) {
        case 'nation':
            break;
        case 'region':
            where = `WHERE lo.region_code = '${location.region.code}'`;
            break;
        default:
            where = `WHERE lo.departement_code = '${location.departement.code}'`;
            break;
    }

    const date = new Date();
    const otherDate = new Date();
    const shantytownWhere = [];
    const shantytownReplacements = {};
    if (restrictedLocation.type !== 'nation') {
        shantytownReplacements.locationCode = restrictedLocation[restrictedLocation.type].code;
        shantytownWhere.push(`${fromGeoLevelToTableName(restrictedLocation.type)}.code = :locationCode`);

        if (restrictedLocation.type === 'city') {
            shantytownWhere.push(`${fromGeoLevelToTableName(restrictedLocation.type)}.fk_main = :locationCode`);
        }
    }

    otherDate.setMonth(date.getMonth() - 3);
    const shantytownStats = await sequelize.query(
        `SELECT 
            population_total as population,
            population_minors as minors,
            minors_in_school,
            shantytowns.updated_at,
            shantytowns.closed_at,
            resorbed,
            shantytowns.shantytown_id as id
        FROM 
            (
                (
                    SELECT shantytowns.updated_at, closed_at, CAST(closed_with_solutions AS text) as resorbed, shantytown_id, population_total, population_minors, minors_in_school, fk_city
                    FROM shantytowns
                )
                UNION
                (
                    SELECT shantytowns.updated_at, closed_at, CAST(closed_with_solutions AS text) as resorbed, shantytown_id, population_total, population_minors, minors_in_school, fk_city
                    FROM "ShantytownHistories" shantytowns
                )
            ) shantytowns
        LEFT JOIN cities ON shantytowns.fk_city = cities.code
        LEFT JOIN epci ON cities.fk_epci = epci.code
        LEFT JOIN departements ON cities.fk_departement = departements.code
        LEFT JOIN regions ON departements.fk_region = regions.code
        ${shantytownWhere.length > 0 ? `WHERE ${shantytownWhere.join(' OR ')}` : ''}
        ORDER BY shantytowns.updated_at DESC`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: shantytownReplacements,
        },
    );

    const connectedUsers = await sequelize.query(
        `SELECT
            COUNT(DISTINCT fk_user),
            (floor((now()::date - datetime::date) / 7)) AS week,
            TO_CHAR((now()::date - ((floor((now()::date - datetime::date) / 7)) * 7)::int) - integer '6', 'DD/MM') AS date_debut,
            TO_CHAR(now()::date - ((floor((now()::date - datetime::date) / 7)) * 7)::int, 'DD/MM') AS date_fin
            FROM 
            user_navigation_logs
        ${where !== null ? `
        LEFT JOIN
            users ON users.user_id = user_navigation_logs.fk_user
        LEFT JOIN
            localized_organizations ON users.fk_organization = localized_organizations.organization_id
        ` : ''}        
        ${where}
        GROUP BY
            (floor((now()::date - datetime::date) / 7)),
            (now()::date - ((floor((now()::date - datetime::date) / 7)) * 7)::int) - integer '6',
            now()::date - ((floor((now()::date - datetime::date) / 7)) * 7)::int
        ORDER BY
                (floor((now()::date - datetime::date) / 7)) + 1 ASC
        LIMIT 13`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    const listOfDates = getArrayOfDates(otherDate, date);
    return decomposeForDiagramm(shantytownStats, connectedUsers, listOfDates);
};
