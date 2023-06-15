import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import permissionUtils from '#server/utils/permission';
import stringifyWhereClause from '#server/models/_common/stringifyWhereClause';
import { WhereClauseGroup } from '#server/models/_common/types/WhereClauseGroup';
import { Origin } from '#root/types/resources/DepartementMetrics.d';

const { where: pWhere } = permissionUtils;


export type DepartementMetricsRawData = {
    shantytown_id: number,
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    city_code: string,
    city_name: string,
    city_latitude: number,
    city_longitude: number,
    population_total: number | null,
    population_couples: number | null,
    population_minors: number | null,
    access_to_water: boolean,
    access_to_electricity: boolean,
    trash_evacuation: boolean,
    fire_prevention: boolean,
    absence_of_pest_animals: boolean,
    toilets: boolean,
    owner_complaint: boolean | null,
    justice_procedure: boolean | null,
    police_status: boolean | null,
    field_type: string,
    origins: Origin[],
    out_of_date: boolean
};

export default async (user, departementCode: string): Promise<DepartementMetricsRawData[]> => {
    const permissionWhereClauseGroup:WhereClauseGroup = pWhere().can(user).do('list', 'shantytown');
    const replacements = {
        departementCode,
    };
    const permissionWhereClause = stringifyWhereClause('shantytowns', [permissionWhereClauseGroup], replacements);

    return sequelize.query(
        `
        WITH shantytown_computed_origins AS (
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
        computed_electricity_types AS (SELECT
            s.shantytown_id AS fk_shantytown,
            array_remove(array_agg(eat.electricity_access_type::text), NULL) AS electricity_access_types
        FROM shantytowns s
        LEFT JOIN electricity_access_types eat ON eat.fk_shantytown = s.shantytown_id
        GROUP BY s.shantytown_id)
        SELECT
            shantytowns.shantytown_id,
            shantytowns.name,
            shantytowns.address,
            shantytowns.latitude,
            shantytowns.longitude,
            cities.code AS city_code,
            cities.name AS city_name,
            cities.latitude AS city_latitude,
            cities.longitude AS city_longitude,
            shantytowns.population_total,
            shantytowns.population_couples,
            shantytowns.population_minors,
            shantytowns.owner_complaint,
            shantytowns.justice_procedure,
            shantytowns.police_status,
            field_types.label AS field_type,
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
            shantytowns.fire_prevention AS "firePrevention"
        FROM shantytowns
        LEFT JOIN field_types ON shantytowns.fk_field_type = field_types.field_type_id
        LEFT JOIN shantytown_computed_origins ON shantytown_computed_origins.fk_shantytown = shantytowns.shantytown_id
        LEFT JOIN computed_toilet_types ON computed_toilet_types.fk_shantytown = shantytowns.shantytown_id
        LEFT JOIN computed_electricity_types ON computed_electricity_types.fk_shantytown = shantytowns.shantytown_id
        LEFT JOIN cities ON cities.code = shantytowns.fk_city
        LEFT JOIN departements ON departements.code = cities.fk_departement
        WHERE closed_at IS NULL
        AND departements.code = :departementCode
        ${permissionWhereClause !== '()' ? `AND ${permissionWhereClause}` : ''}
        `,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
};
