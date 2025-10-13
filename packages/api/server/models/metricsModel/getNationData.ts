import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import moment from 'moment';
import permissionUtils from '#server/utils/permission';
import stringifyWhereClause from '#server/models/_common/stringifyWhereClause';
import { WhereClauseGroup } from '#server/models/_common/types/Where.d';

const { where: pWhere } = permissionUtils;


export type NationMetricsRawData = {
    shantytown_id: number,
    input_date: Date,
    known_since: Date,
    closed_at: Date,
    population_total: number,
    access_to_water: boolean,
    region_code: string,
    region_name: string,
    is_oversea: boolean,
    departement_code: string,
    departement_name: string,
    origins?: string[],
};

export default async (user, from: Date, to: Date): Promise<NationMetricsRawData[]> => {
    const permissionWhereClauseGroup:WhereClauseGroup = pWhere().can(user).do('list', 'shantytown');
    const replacements = {
        from: `${moment(from).format('YYYY-MM-DD')} 23:59:59`,
        to: `${moment(to).format('YYYY-MM-DD')} 23:59:59`,
    };
    const permissionWhereClause = stringifyWhereClause('shantytowns', [permissionWhereClauseGroup], replacements);

    return sequelize.query(
        `SELECT 
            t.*
        FROM (
            (WITH shantytown_computed_origins AS (
                SELECT
                    s.shantytown_id AS fk_shantytown,
                    array_agg(soo.uid) AS origins
                FROM shantytowns s
                LEFT JOIN shantytown_origins so ON so.fk_shantytown = s.shantytown_id
                LEFT JOIN social_origins soo ON so.fk_social_origin = soo.social_origin_id
                GROUP BY s.shantytown_id
            ),
            shantytowns_today AS (
                SELECT
                    shantytowns.shantytown_id,
                    LEAST(shantytowns.built_at, shantytowns.declared_at, shantytowns.created_at) AS known_since,
                    shantytowns.closed_at,
                    regions.code AS region_code,
                    regions.name AS region_name,
                    regions.code IN ('01', '02', '03', '04', '06') AS is_oversea,
                    departements.code AS departement_code,
                    departements.name AS departement_name,
                    cities.code AS city_code,
                    epci.code AS epci_code,
                    shantytowns.status AS status
                FROM shantytowns
                LEFT JOIN cities ON shantytowns.fk_city = cities.code
                LEFT JOIN epci ON cities.fk_epci = epci.code
                LEFT JOIN departements ON cities.fk_departement = departements.code
                LEFT JOIN regions ON departements.fk_region = regions.code
            )
            SELECT 
                shantytowns.shantytown_id,
                shantytowns.population_total,
                COALESCE(shantytowns.updated_at, shantytowns.created_at) AS input_date,
                shantytowns_today.known_since,
                shantytowns_today.closed_at,
                shantytowns_today.region_code,
                shantytowns_today.region_name,
                shantytowns_today.is_oversea,
                shantytowns_today.departement_code,
                shantytowns_today.departement_name,
                shantytowns_today.status,
                computed_origins.origins,
                CASE
                    WHEN 
                        (shantytowns.water_access_type = 'robinet_connecte_au_reseau' OR shantytowns.water_access_type = 'autre')
                        AND ( water_access_is_unequal IS NULL OR water_access_is_unequal = false)
                        AND water_access_is_public = false
                        AND water_access_is_local = true
                        AND (water_access_is_continuous IS NULL OR water_access_is_continuous = true)
                        AND (water_access_is_close IS NULL OR water_access_is_close = true)
                        AND (water_access_has_stagnant_water IS NULL OR water_access_has_stagnant_water  = false)
                    THEN true
                    ELSE false
                END AS access_to_water
            FROM shantytowns
            LEFT JOIN shantytowns_today ON shantytowns_today.shantytown_id = shantytowns.shantytown_id
            LEFT JOIN regions ON regions.code = shantytowns_today.region_code
            LEFT JOIN departements ON departements.code = shantytowns_today.departement_code
            LEFT JOIN epci ON epci.code = shantytowns_today.epci_code
            LEFT JOIN cities ON cities.code = shantytowns_today.city_code
            LEFT JOIN shantytown_computed_origins AS computed_origins ON computed_origins.fk_shantytown = shantytowns.shantytown_id
            WHERE
                shantytowns_today.known_since <= :to
            AND
                (shantytowns_today.closed_at IS NULL OR (shantytowns_today.closed_at > :from AND shantytowns_today.status <> 'open'))
            ${permissionWhereClause !== '()' ? `AND ${permissionWhereClause}` : ''})
            UNION
            
            (WITH shantytown_computed_origins AS (
                SELECT
                    s.shantytown_id AS fk_shantytown,
                    array_agg(soo.uid) AS origins
                FROM shantytowns s
                LEFT JOIN shantytown_origins so ON so.fk_shantytown = s.shantytown_id
                LEFT JOIN social_origins soo ON so.fk_social_origin = soo.social_origin_id
                GROUP BY s.shantytown_id
            ),
            shantytowns_today AS (
                SELECT
                    shantytowns.shantytown_id,
                    LEAST(shantytowns.built_at, shantytowns.declared_at, shantytowns.created_at) AS known_since,
                    shantytowns.closed_at,
                    regions.code AS region_code,
                    regions.name AS region_name,
                    regions.code IN ('01', '02', '03', '04', '06') AS is_oversea,
                    departements.code AS departement_code,
                    departements.name AS departement_name,
                    cities.code AS city_code,
                    epci.code AS epci_code,
                    shantytowns.status AS status
                FROM shantytowns
                LEFT JOIN cities ON shantytowns.fk_city = cities.code
                LEFT JOIN epci ON cities.fk_epci = epci.code
                LEFT JOIN departements ON cities.fk_departement = departements.code
                LEFT JOIN regions ON departements.fk_region = regions.code
            )
            SELECT 
                shantytowns.shantytown_id,
                shantytowns.population_total,
                COALESCE(shantytowns.updated_at, shantytowns.created_at) AS input_date,
                shantytowns_today.known_since,
                shantytowns_today.closed_at,
                shantytowns_today.region_code,
                shantytowns_today.region_name,
                shantytowns_today.is_oversea,
                shantytowns_today.departement_code,
                shantytowns_today.departement_name,
                shantytowns_today.status,
                computed_origins.origins,
                CASE
                    WHEN 
                        (shantytowns.water_access_type = 'robinet_connecte_au_reseau' OR shantytowns.water_access_type = 'autre')
                        AND ( water_access_is_unequal IS NULL OR water_access_is_unequal = false)
                        AND water_access_is_public = false
                        AND water_access_is_local = true
                        AND (water_access_is_continuous IS NULL OR water_access_is_continuous = true)
                        AND (water_access_is_close IS NULL OR water_access_is_close = true)
                        AND (water_access_has_stagnant_water IS NULL OR water_access_has_stagnant_water  = false)
                    THEN true
                    ELSE false
                END AS access_to_water
            FROM "ShantytownHistories" shantytowns
            LEFT JOIN shantytowns_today ON shantytowns_today.shantytown_id = shantytowns.shantytown_id
            LEFT JOIN regions ON regions.code = shantytowns_today.region_code
            LEFT JOIN departements ON departements.code = shantytowns_today.departement_code
            LEFT JOIN epci ON epci.code = shantytowns_today.epci_code
            LEFT JOIN cities ON cities.code = shantytowns_today.city_code
            LEFT JOIN shantytown_computed_origins AS computed_origins ON computed_origins.fk_shantytown = shantytowns.shantytown_id
            WHERE
                shantytowns_today.known_since <= :to
            AND
                (shantytowns_today.closed_at IS NULL OR (shantytowns_today.closed_at > :from AND shantytowns_today.status <> 'open'))
            ${permissionWhereClause !== '()' ? `AND ${permissionWhereClause}` : ''})
        ) t
        ORDER BY t.shantytown_id ASC, t.input_date DESC`,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
};
