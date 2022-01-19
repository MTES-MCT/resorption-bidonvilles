const selectModificationValues = [
    'shantytown_id',
    'name',
    'built_at',
    'declared_at',
    'address',
    'address_details',
    'owner',
    'is_reinstallation',
    'reinstallation_comments',
    'census_status',
    'census_conducted_at',
    'census_conducted_by',
    'population_total',
    'population_couples',
    'population_minors',
    'population_minors_0_3',
    'population_minors_3_6',
    'population_minors_6_12',
    'population_minors_12_16',
    'population_minors_16_18',
    'field_type',
    'owner_type',
    'social_origins',
    'electricity_type',
    'electricity_comments',
    'access_to_sanitary',
    'sanitary_comments',
    'access_to_water',
    'water_comments',
    'water_potable',
    'water_continuous_access',
    'water_public_point',
    'water_distance',
    'water_roads_to_cross',
    'water_everyone_has_access',
    'water_stagnant_water',
    'water_hand_wash_access',
    'water_hand_wash_access_number',
    'sanitary_number',
    'sanitary_insalubrious',
    'sanitary_on_site',
    'trash_evacuation',
    'trash_cans_on_site',
    'trash_accumulation',
    'trash_evacuation_regular',
    'vermin',
    'vermin_comments',
    'fire_prevention_measures',
    'fire_prevention_diagnostic',
    'fire_prevention_site_accessible',
    'fire_prevention_devices',
    'fire_prevention_comments',
    'owner_complaint',
    'justice_procedure',
    'justice_rendered',
    'justice_rendered_at',
    'justice_rendered_by',
    'justice_challenged',
    'police_status',
    'police_requested_at',
    'police_granted_at',
    'bailiff',
];

const selectShantytownsValues = [
    'shantytowns.updated_by',
    'shantytowns.shantytown_id',
    'shantytowns.updated_at as date',
    'shantytowns.name',
    'shantytowns.built_at',
    'shantytowns.declared_at',
    'shantytowns.address',
    'shantytowns.address_details',
    'shantytowns.owner',
    'shantytowns.is_reinstallation',
    'shantytowns.reinstallation_comments',
    'shantytowns.census_status::text',
    'shantytowns.census_conducted_at',
    'shantytowns.census_conducted_by',
    'shantytowns.population_total',
    'shantytowns.population_couples',
    'shantytowns.population_minors',
    'shantytowns.population_minors_0_3',
    'shantytowns.population_minors_3_6',
    'shantytowns.population_minors_6_12',
    'shantytowns.population_minors_12_16',
    'shantytowns.population_minors_16_18',
    'field_types.label as field_type',
    'owner_types.label as owner_type',
    'sco.origins AS social_origins',
    'electricity_types.label as electricity_type',
    'shantytowns.electricity_comments',
    'shantytowns.access_to_sanitary',
    'shantytowns.sanitary_comments',
    'shantytowns.access_to_water',
    'shantytowns.water_comments',
    'shantytowns.water_potable',
    'shantytowns.water_continuous_access',
    'shantytowns.water_public_point',
    'shantytowns.water_distance::text',
    'shantytowns.water_roads_to_cross',
    'shantytowns.water_everyone_has_access',
    'shantytowns.water_stagnant_water',
    'shantytowns.water_hand_wash_access',
    'shantytowns.water_hand_wash_access_number',
    'shantytowns.sanitary_number',
    'shantytowns.sanitary_insalubrious',
    'shantytowns.sanitary_on_site',
    'shantytowns.trash_evacuation',
    'shantytowns.trash_cans_on_site',
    'shantytowns.trash_accumulation',
    'shantytowns.trash_evacuation_regular',
    'shantytowns.vermin',
    'shantytowns.vermin_comments',
    'shantytowns.fire_prevention_measures',
    'shantytowns.fire_prevention_diagnostic',
    'shantytowns.fire_prevention_site_accessible',
    'shantytowns.fire_prevention_devices',
    'shantytowns.fire_prevention_comments',
    'shantytowns.owner_complaint',
    'shantytowns.justice_procedure',
    'shantytowns.justice_rendered',
    'shantytowns.justice_rendered_at',
    'shantytowns.justice_rendered_by',
    'shantytowns.justice_challenged',
    'shantytowns.police_status::text',
    'shantytowns.police_requested_at',
    'shantytowns.police_granted_at',
    'shantytowns.bailiff',
];

const intermediary = selectModificationValues.map(value => `modifications.${value}, lag(modifications.${value}) over (ORDER BY modifications.shantytown_id asc, modifications.date asc) AS lag_${value}`);
const where = selectModificationValues.map(value => `((${value} IS NULL AND lag_${value} is NULL) OR ${value} = lag_${value})`);

const finalRequest = `
    WITH table_duplicates AS (SELECT 
        modifications.date,
        modifications.hid, lag(modifications.hid) over (ORDER BY modifications.shantytown_id asc, modifications.date asc) AS lag_hid,
        modifications.updated_by, lag(modifications.updated_by) over (ORDER BY modifications.shantytown_id asc, modifications.date asc) AS lag_updated_by,
        ${intermediary.join(', ')}
    FROM 
    (
        (WITH 
        shantytown_histories_computed_origins AS (SELECT 
            sh.hid AS fk_shantytown, 
            string_to_array(array_to_string(array_agg(soo.social_origin_id::VARCHAR || '|' || soo.label), ','), ',') AS origins 
        FROM "ShantytownHistories" sh
        LEFT JOIN "ShantytownOriginHistories" so ON so.fk_shantytown = sh.hid
        LEFT JOIN social_origins soo ON so.fk_social_origin = soo.social_origin_id
        GROUP BY sh.hid
        )
    SELECT
    shantytowns.hid,
    ${selectShantytownsValues.join(', ')}
    FROM "ShantytownHistories" shantytowns
    LEFT JOIN field_types ON shantytowns.fk_field_type = field_types.field_type_id
    LEFT JOIN owner_types ON shantytowns.fk_owner_type = owner_types.owner_type_id
    LEFT JOIN electricity_types ON shantytowns.fk_electricity_type = electricity_types.electricity_type_id
    LEFT JOIN shantytown_histories_computed_origins sco ON sco.fk_shantytown = shantytowns.hid
    WHERE shantytowns.closed_at IS NULL
    )

    UNION ALL

    (with shantytown_computed_origins as (SELECT
            sh.shantytown_id AS fk_shantytown, 
            string_to_array(array_to_string(array_agg(soo.social_origin_id::VARCHAR || '|' || soo.label), ','), ',') AS origins 
        FROM shantytowns sh
        LEFT JOIN shantytown_origins so ON so.fk_shantytown = sh.shantytown_id 
        LEFT JOIN social_origins soo ON so.fk_social_origin = soo.social_origin_id
        GROUP BY sh.shantytown_id 
        )
    SELECT
    0 AS hid,
    ${selectShantytownsValues.join(', ')}
    FROM shantytowns shantytowns
    LEFT JOIN field_types ON shantytowns.fk_field_type = field_types.field_type_id
    LEFT JOIN owner_types ON shantytowns.fk_owner_type = owner_types.owner_type_id
    LEFT JOIN electricity_types ON shantytowns.fk_electricity_type = electricity_types.electricity_type_id
    LEFT JOIN shantytown_computed_origins sco ON sco.fk_shantytown = shantytowns.shantytown_id
    WHERE shantytowns.closed_at IS NULL
    )) modifications
    ORDER BY modifications.date DESC)
    SELECT hid, lag_hid, shantytown_id, updated_by, lag_updated_by FROM table_duplicates
    WHERE ${where.join(' AND ')}`;


module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        const historyDuplicates = await queryInterface.sequelize.query(
            finalRequest,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        );

        await Promise.all(historyDuplicates.reduce((acc, town) => {
            if (town.hid !== 0) {
                acc.push(queryInterface.sequelize.query('DELETE FROM "ShantytownHistories" WHERE hid = :hid', {
                    transaction,
                    replacements: {
                        hid: town.hid,
                    },
                }));
            } else {
                acc.push(queryInterface.sequelize.query('DELETE FROM "ShantytownHistories" WHERE hid = :hid', {
                    transaction,
                    replacements: {
                        hid: town.lag_hid,
                    },
                }));
                acc.push(queryInterface.sequelize.query('UPDATE shantytowns SET updated_by = :updated_by WHERE shantytown_id = :id', {
                    transaction,
                    replacements: {
                        updated_by: town.lag_updated_by,
                        id: town.shantytown_id,
                    },
                }));
            }
            return acc;
        }, []));
        return transaction.commit();
    },
    async down(queryInterface) {
        // no need to do anything here
        const transaction = await queryInterface.sequelize.transaction();
        return transaction.commit();
    },
};
