import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import permissionUtils from '#server/utils/permission';
import stringifyWhereClause from '#server/models/_common/stringifyWhereClause';
import { WhereClauseGroup } from '#server/models/_common/types/WhereClauseGroup';
import decomposeForDiagramm from './_common/decomposeForDiagramm';
import getArrayOfDates from './_common/getArrayOfDates';


const { where: pWhere } = permissionUtils;

export default async (user, location) => {
    const permissionWhereClauseGroup:WhereClauseGroup = pWhere().can(user).do('list', 'shantytown');
    const replacements = { userId: user.id };
    const permissionWhereClause = stringifyWhereClause('shantytowns', [permissionWhereClauseGroup], replacements);

    let where = '';
    let shantytownWhere = '';

    switch (location.type) {
        case 'nation':
            break;
        case 'region':
            where = `WHERE lo.region_code = '${location.region.code}'`;
            shantytownWhere = `WHERE regions.code = '${location.region.code}'`;
            break;
        case 'departement':
            where = `WHERE lo.departement_code = '${location.departement.code}'`;
            shantytownWhere = `WHERE departements.code = '${location.departement.code}'`;
            break;
        case 'epci':
            where = `WHERE lo.departement_code = '${location.departement.code}'`;
            shantytownWhere = `WHERE epci.code = '${location.epci.code}'`;
            break;
        case 'city':
            where = `WHERE lo.departement_code = '${location.departement.code}'`;
            shantytownWhere = `WHERE cities.code = '${location.city.code}'`;
            break;
        default:
            break;
    }

    if (shantytownWhere.length > 0 && permissionWhereClause !== '()') {
        shantytownWhere += ` AND ${permissionWhereClause}`;
    } else if (permissionWhereClause !== '()') {
        shantytownWhere += ` WHERE ${permissionWhereClause}`;
    }

    const date = new Date();
    const otherDate = new Date();
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
                ${shantytownWhere}
            )
            ORDER BY shantytowns.updated_at DESC`,
            {
                type: QueryTypes.SELECT,
                replacements,
            },
        ),
        // WAU
        sequelize.query(
            `
            SELECT
                COUNT(fk_user),
                week,
                TO_CHAR((now()::date - INTERVAL '1 day' * ((week * 7) + 6)) - INTERVAL '1 day', 'DD/MM') AS date_debut,
                TO_CHAR((now()::date - INTERVAL '1 day' * (week * 7)) - INTERVAL '1 day', 'DD/MM') AS date_fin
            FROM (
                SELECT fk_user, week 
                    FROM (
                        (
                            SELECT
                                fk_user,
                                (floor(((now() - INTERVAL '1 day')::date - datetime::date) / 7)) AS week
                            FROM user_webapp_navigation_logs
                            WHERE datetime::date < now()::date
                        )
                        UNION
                        (
                            SELECT
                                fk_user,
                                (floor(((now() - INTERVAL '1 day')::date - datetime::date) / 7)) AS week
                            FROM user_mobile_navigation_logs
                            WHERE datetime::date < now()::date
                        )
                    ) AS unl
                    GROUP BY fk_user, week
            ) t
            ${where !== null ? `
            LEFT JOIN users ON users.user_id = t.fk_user
            LEFT JOIN localized_organizations lo ON users.fk_organization = lo.organization_id
            ${where}` : ''}
            GROUP BY week
            ORDER BY week ASC
            LIMIT 13`,
            {
                type: QueryTypes.SELECT,
            },
        ),
    ]);

    if (shantytownStats.length === 0) {
        return null;
    }
    const listOfDates = getArrayOfDates(otherDate, date);

    return decomposeForDiagramm(shantytownStats, connectedUsers, listOfDates);
};
