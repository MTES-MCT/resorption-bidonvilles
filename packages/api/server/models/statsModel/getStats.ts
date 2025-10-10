import { sequelize } from '#db/sequelize';
import { BindOrReplacements, QueryTypes } from 'sequelize';
import permissionUtils from '#server/utils/permission';
import stringifyWhereClause from '#server/models/_common/stringifyWhereClause';
import { WhereClauseGroup } from '#server/models/_common/types/Where.d';
import { Location } from '#server/models/geoModel/Location.d';
import decomposeForDiagramm from './_common/decomposeForDiagramm';
import getArrayOfDates from './_common/getArrayOfDates';
import { User } from '#root/types/resources/User.d';


const { where: pWhere } = permissionUtils;

export default async (user: User, location: Location) => {
    const permissionWhereClauseGroup:WhereClauseGroup = pWhere().can(user).do('list', 'shantytown');
    const replacements: BindOrReplacements = { userId: user.id };
    const permissionWhereClause = stringifyWhereClause('shantytowns', [permissionWhereClauseGroup], replacements);

    let where = '';
    let shantytownWhere = '';

    switch (location.type) {
        case 'nation':
            break;
        case 'region':
            replacements.regionCode = location.region.code;
            where = 'WHERE :regionCode = ANY(v_user_areas.regions)';
            shantytownWhere = 'WHERE regions.code = :regionCode';
            break;
        case 'departement':
            replacements.departementCode = location.departement.code;
            where = 'WHERE :departementCode = ANY(v_user_areas.departements)';
            shantytownWhere = 'WHERE departements.code = :departementCode';
            break;
        case 'epci':
            replacements.departementCode = location.epci.code;
            replacements.epciCode = location.epci.code;
            where = 'WHERE :departementCode = ANY(v_user_areas.departements)';
            shantytownWhere = 'WHERE epci.code = :epciCode';
            break;
        case 'city':
            replacements.departementCode = location.epci.code;
            replacements.cityCode = location.city.code;
            where = 'WHERE :departementCode = ANY(v_user_areas.departements)';
            shantytownWhere = 'WHERE cities.code = :cityCode OR cities.fk_main = :cityCode';
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
                SELECT
                    fk_user,
                    (floor(((now() - INTERVAL '1 day')::date - datetime::date) / 7)) AS week
                FROM user_webapp_navigation_logs
                WHERE datetime::date < now()::date
                GROUP BY fk_user, week
            ) t
            ${where !== null ? `
            LEFT JOIN users ON users.user_id = t.fk_user
            LEFT JOIN v_user_areas ON users.user_id = v_user_areas.user_id
            ${where}` : ''}
            GROUP BY week
            ORDER BY week ASC
            LIMIT 13`,
            {
                type: QueryTypes.SELECT,
                replacements,
            },
        ),
    ]);

    if (shantytownStats.length === 0) {
        return null;
    }

    const listOfDates = getArrayOfDates(otherDate, date);
    return decomposeForDiagramm(shantytownStats, connectedUsers, listOfDates);
};
