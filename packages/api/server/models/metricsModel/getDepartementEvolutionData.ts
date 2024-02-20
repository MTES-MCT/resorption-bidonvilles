import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import moment from 'moment';
import permissionUtils from '#server/utils/permission';
import stringifyWhereClause from '#server/models/_common/stringifyWhereClause';
import { WhereClauseGroup } from '#server/models/_common/types/WhereClauseGroup';
import { Origin } from '#root/types/resources/DepartementMetrics.d';

const { where: pWhere } = permissionUtils;


export type DepartementEvolutionMetricsRawData = {
    shantytown_id: number,
    population_total: number,
    input_date: Date,
    known_since: Date,
    closed_at: Date,
    origins: Origin[],
    waterAccessType: string,
    waterAccessIsPublic: boolean | null,
    waterAccessIsContinuous: boolean | null,
    waterAccessIsLocal: boolean | null,
    waterAccessIsClose: boolean | null,
    waterAccessIsUnequal: boolean | null,
    waterAccessHasStagnantWater: boolean | null,
    toiletTypes: string[],
    sanitaryAccessOpenAirDefecation: boolean | null,
    sanitaryAccessWorkingToilets: boolean | null,
    sanitaryAccessToiletsAreInside: boolean | null,
    sanitaryAccessToiletsAreLighted: boolean | null,
    sanitaryAccessHandWashing: boolean | null,
    electricityAccess: boolean | null,
    electricityAccessTypes: string[],
    electricityAccessIsUnequal: boolean | null,
    trashIsPiling: boolean | null,
    trashEvacuationIsClose: boolean | null,
    trashEvacuationIsSafe: boolean | null,
    trashEvacuationIsRegular: boolean | null,
    trashBulkyIsPiling: boolean | null,
    pestAnimals: boolean | null,
    firePrevention: boolean | null,
    owner_complaint: boolean | null,
    police_status: string,
};

export default async (user, departementCode, from: Date, to: Date): Promise<DepartementEvolutionMetricsRawData[]> => {
    const permissionWhereClauseGroup:WhereClauseGroup = pWhere().can(user).do('list', 'shantytown');
    const replacements = {
        departementCode,
        from: `${moment(from).format('YYYY-MM-DD')} 23:59:59`,
        to: `${moment(to).format('YYYY-MM-DD')} 23:59:59`,
    };
    const permissionWhereClause = stringifyWhereClause('shantytowns', [permissionWhereClauseGroup], replacements);

    return sequelize.query(
        `SELECT
            t.*
        FROM (
            (WITH shantytowns_today AS (
                SELECT
                    shantytowns.shantytown_id,
                    LEAST(shantytowns.built_at, shantytowns.declared_at, shantytowns.created_at) AS known_since,
                    shantytowns.closed_at,
                    departements.code AS departement_code,
                    departements.name AS departement_name
                FROM shantytowns
                LEFT JOIN cities ON shantytowns.fk_city = cities.code
                LEFT JOIN departements ON cities.fk_departement = departements.code
            ),
            shantytown_computed_origins AS (
                        SELECT
                            s.shantytown_id AS fk_shantytown,
                            string_to_array(array_to_string(array_agg(soo.uid), ','), ',') AS origins
                        FROM shantytowns s
                        LEFT JOIN shantytown_origins so ON so.fk_shantytown = s.shantytown_id
                        LEFT JOIN social_origins soo ON so.fk_social_origin = soo.social_origin_id
                        GROUP BY s.shantytown_id),
            computed_toilet_types AS (
                        SELECT
                            s.shantytown_id AS fk_shantytown,
                            string_to_array(array_to_string(array_agg(stt.toilet_type), ','), ',') AS toilet_types
                        FROM shantytowns s
                        LEFT JOIN shantytown_toilet_types stt ON stt.fk_shantytown = s.shantytown_id
                        GROUP BY s.shantytown_id
                    ),
            computed_electricity_types AS (
                        SELECT
                            s.shantytown_id AS fk_shantytown,
                            array_remove(array_agg(eat.electricity_access_type::text), NULL) AS electricity_access_types
                        FROM shantytowns s
                        LEFT JOIN electricity_access_types eat ON eat.fk_shantytown = s.shantytown_id
                        GROUP BY s.shantytown_id
                    )
            SELECT
                    0 as hid,
                shantytowns.shantytown_id,
                shantytowns.population_total,
                COALESCE(shantytowns.updated_at, shantytowns.created_at) AS input_date,
                shantytowns_today.known_since,
                shantytowns_today.closed_at,
                shantytown_computed_origins.origins,
                shantytowns.water_access_type::text AS "waterAccessType",
                shantytowns.water_access_is_public AS "waterAccessIsPublic",
                shantytowns.water_access_is_continuous AS "waterAccessIsContinuous",
                shantytowns.water_access_is_local AS "waterAccessIsLocal",
                shantytowns.water_access_is_close AS "waterAccessIsClose",
                shantytowns.water_access_is_unequal AS "waterAccessIsUnequal",
                shantytowns.water_access_has_stagnant_water AS "waterAccessHasStagnantWater",
                computed_toilet_types.toilet_types AS "toiletTypes",
                shantytowns.sanitary_access_open_air_defecation AS "sanitaryAccessOpenAirDefecation",
                shantytowns.sanitary_access_working_toilets AS "sanitaryAccessWorkingToilets",
                shantytowns.sanitary_access_toilets_are_inside AS "sanitaryAccessToiletsAreInside",
                shantytowns.sanitary_access_toilets_are_lighted AS "sanitaryAccessToiletsAreLighted",
                shantytowns.sanitary_access_hand_washing AS "sanitaryAccessHandWashing",
                shantytowns.electricity_access AS "electricityAccess",
                computed_electricity_types.electricity_access_types AS "electricityAccessTypes",
                shantytowns.electricity_access_is_unequal AS "electricityAccessIsUnequal",
                shantytowns.trash_is_piling AS "trashIsPiling",
                shantytowns.trash_evacuation_is_close AS "trashEvacuationIsClose",
                shantytowns.trash_evacuation_is_safe AS "trashEvacuationIsSafe",
                shantytowns.trash_evacuation_is_regular AS "trashEvacuationIsRegular",
                shantytowns.trash_bulky_is_piling AS "trashBulkyIsPiling",
                shantytowns.pest_animals AS "pestAnimals",
                shantytowns.fire_prevention AS "firePrevention",
                shantytowns.owner_complaint,
                shantytowns.police_status::text
            FROM shantytowns
            LEFT JOIN shantytowns_today ON shantytowns_today.shantytown_id = shantytowns.shantytown_id
            LEFT JOIN shantytown_computed_origins ON shantytown_computed_origins.fk_shantytown = shantytowns.shantytown_id
            LEFT JOIN computed_toilet_types ON computed_toilet_types.fk_shantytown = shantytowns.shantytown_id
            LEFT JOIN computed_electricity_types ON computed_electricity_types.fk_shantytown = shantytowns.shantytown_id
            LEFT JOIN departements ON departements.code = shantytowns_today.departement_code
            LEFT JOIN regions ON regions.code = departements.fk_region
            WHERE
                shantytowns_today.departement_code = :departementCode
            AND
                shantytowns_today.known_since <= :to
            AND
                (shantytowns.updated_at  <= :to OR shantytowns.updated_at = shantytowns.created_at)
            AND
                (shantytowns_today.closed_at IS NULL OR shantytowns_today.closed_at > :from)
            ${permissionWhereClause !== '()' ? `AND ${permissionWhereClause}` : ''}
            )

            UNION
            
            (WITH shantytowns_today AS (
                SELECT
                    shantytowns.shantytown_id,
                    LEAST(shantytowns.built_at, shantytowns.declared_at, shantytowns.created_at) AS known_since,
                    shantytowns.closed_at,
                    departements.code AS departement_code,
                    departements.name AS departement_name
                FROM shantytowns
                LEFT JOIN cities ON shantytowns.fk_city = cities.code
                LEFT JOIN departements ON cities.fk_departement = departements.code
            ), 
            shantytown_computed_origins AS (
                        SELECT
                            s.hid AS fk_shantytown,
                            string_to_array(array_to_string(array_agg(soo.uid), ','), ',') AS origins
                        FROM "ShantytownHistories" s
                        LEFT JOIN "ShantytownOriginHistories" so ON so.fk_shantytown = s.hid
                        LEFT JOIN social_origins soo ON so.fk_social_origin = soo.social_origin_id
                        GROUP BY s.hid),
            computed_toilet_types AS (
                        SELECT
                            s.hid AS fk_shantytown,
                            string_to_array(array_to_string(array_agg(stt.toilet_type), ','), ',') AS toilet_types
                        FROM "ShantytownHistories" s
                        LEFT JOIN shantytown_toilet_types_history stt ON stt.fk_shantytown = s.hid
                        GROUP BY s.hid
                    ),
            computed_electricity_types AS (
                        SELECT
                            s.hid AS fk_shantytown,
                            array_remove(array_agg(eat.electricity_access_type::text), NULL) AS electricity_access_types
                        FROM "ShantytownHistories" s
                        LEFT JOIN electricity_access_types_history eat ON eat.fk_shantytown = s.hid
                        GROUP BY s.hid
                    )
            SELECT
                    shantytowns.hid,
                shantytowns.shantytown_id,
                shantytowns.population_total,
                COALESCE(shantytowns.updated_at, shantytowns.created_at) AS input_date,
                shantytowns_today.known_since,
                shantytowns_today.closed_at,
                shantytown_computed_origins.origins,
                shantytowns.water_access_type::text AS "waterAccessType",
                shantytowns.water_access_is_public AS "waterAccessIsPublic",
                shantytowns.water_access_is_continuous AS "waterAccessIsContinuous",
                shantytowns.water_access_is_local AS "waterAccessIsLocal",
                shantytowns.water_access_is_close AS "waterAccessIsClose",
                shantytowns.water_access_is_unequal AS "waterAccessIsUnequal",
                shantytowns.water_access_has_stagnant_water AS "waterAccessHasStagnantWater",
                computed_toilet_types.toilet_types AS "toiletTypes",
                shantytowns.sanitary_access_open_air_defecation AS "sanitaryAccessOpenAirDefecation",
                shantytowns.sanitary_access_working_toilets AS "sanitaryAccessWorkingToilets",
                shantytowns.sanitary_access_toilets_are_inside AS "sanitaryAccessToiletsAreInside",
                shantytowns.sanitary_access_toilets_are_lighted AS "sanitaryAccessToiletsAreLighted",
                shantytowns.sanitary_access_hand_washing AS "sanitaryAccessHandWashing",
                shantytowns.electricity_access AS "electricityAccess",
                computed_electricity_types.electricity_access_types AS "electricityAccessTypes",
                shantytowns.electricity_access_is_unequal AS "electricityAccessIsUnequal",
                shantytowns.trash_is_piling AS "trashIsPiling",
                shantytowns.trash_evacuation_is_close AS "trashEvacuationIsClose",
                shantytowns.trash_evacuation_is_safe AS "trashEvacuationIsSafe",
                shantytowns.trash_evacuation_is_regular AS "trashEvacuationIsRegular",
                shantytowns.trash_bulky_is_piling AS "trashBulkyIsPiling",
                shantytowns.pest_animals AS "pestAnimals",
                shantytowns.fire_prevention AS "firePrevention",
                shantytowns.owner_complaint,
                shantytowns.police_status::text
            FROM "ShantytownHistories" shantytowns
            LEFT JOIN shantytowns_today ON shantytowns_today.shantytown_id = shantytowns.shantytown_id
            LEFT JOIN shantytown_computed_origins ON shantytown_computed_origins.fk_shantytown = shantytowns.hid
            LEFT JOIN computed_toilet_types ON computed_toilet_types.fk_shantytown = shantytowns.hid
            LEFT JOIN computed_electricity_types ON computed_electricity_types.fk_shantytown = shantytowns.hid
            LEFT JOIN departements ON departements.code = shantytowns_today.departement_code
            LEFT JOIN regions ON regions.code = departements.fk_region
            WHERE
                shantytowns_today.departement_code = :departementCode
            AND
                shantytowns_today.known_since <= :to
            AND
                (shantytowns.updated_at  <= :to OR shantytowns.updated_at = shantytowns.created_at)
            AND
                (shantytowns_today.closed_at IS NULL OR shantytowns_today.closed_at > :from)
            ${permissionWhereClause !== '()' ? `AND ${permissionWhereClause}` : ''}
            )
        ) t
        ORDER BY t.shantytown_id ASC, t.input_date DESC`,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
};
