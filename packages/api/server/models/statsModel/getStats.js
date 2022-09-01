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
    const [shantytownStats, connectedUsers] = await Promise.all([
        // Shantytown stats
        sequelize.query(
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
            ${shantytownWhere.length > 0 ? `
            -- -------
            -- une adresse d'un site peut changer en cours de route, donc on fait un select where uniquement sur shantytowns
            -- puis on filtre l'ensemble par id
            -- -------
            WHERE shantytown_id IN (
                SELECT s.shantytown_id
                FROM shantytowns s
                LEFT JOIN cities ON s.fk_city = cities.code
                LEFT JOIN epci ON cities.fk_epci = epci.code
                LEFT JOIN departements ON cities.fk_departement = departements.code
                LEFT JOIN regions ON departements.fk_region = regions.code
                WHERE ${shantytownWhere.join(' OR ')}
            )` : ''}
            ORDER BY shantytowns.updated_at DESC`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: shantytownReplacements,
            },
        ),
        // WAU
        sequelize.query(
            `
            SELECT
                COUNT(DISTINCT fk_user),
                week,
                TO_CHAR((now()::date - INTERVAL '1 day' * ((week * 7) + 6)) - INTERVAL '1 day', 'DD/MM') AS date_debut,
                TO_CHAR((now()::date - INTERVAL '1 day' * (week * 7)) - INTERVAL '1 day', 'DD/MM') AS date_fin
            FROM (
                SELECT
                    fk_user,
                    (floor(((now() - INTERVAL '1 day')::date - datetime::date) / 7)) AS week
                FROM user_navigation_logs
            ) t
            ${where !== null ? `
            LEFT JOIN users ON users.user_id = t.fk_user
            LEFT JOIN localized_organizations lo ON users.fk_organization = lo.organization_id
            ${where}` : ''}
            GROUP BY week
            ORDER BY week ASC
            LIMIT 13`,
            {
                type: sequelize.QueryTypes.SELECT,
            },
        ),
    ]);

    const listOfDates = getArrayOfDates(otherDate, date);
    return decomposeForDiagramm(shantytownStats, connectedUsers, listOfDates);
};
