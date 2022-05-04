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
                unl.fk_user AS user_id,
                TO_CHAR(unl.datetime, 'YYYY-MM-DD') AS date_log,
                COUNT(*)
        FROM
                user_navigation_logs unl 
        LEFT JOIN
                users u ON u.user_id = unl.fk_user
        LEFT JOIN
                localized_organizations lo ON u.fk_organization = lo.organization_id
        ${where}
        GROUP BY
                date_log,
                fk_user
        ORDER BY
                date_log DESC,
                fk_user`,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    const listOfDates = getArrayOfDates(otherDate, date);
    return decomposeForDiagramm(shantytownStats, connectedUsers, listOfDates);
};
