import { sequelize } from '#db/sequelize';
import incomingTownsModel from '#server/models/incomingTownsModel';
import { Transaction } from 'sequelize';

export default async (editor, shantytownId: number, data, argTransaction: Transaction = undefined): Promise<number> => {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();

    try {
        // save the current state of the shantytown
        const [[{ hid }]]: any = await sequelize.query(
            `INSERT INTO
                    "ShantytownHistories"(
                        shantytown_id,
                        updated_without_any_change,
                        status,
                        closing_context,
                        name,
                        latitude,
                        longitude,
                        address,
                        address_details,
                        fk_city,
                        built_at,
                        declared_at,
                        closed_at,
                        fk_field_type,
                        owner,
                        fk_owner_type,
                        is_reinstallation,
                        reinstallation_comments,
                        census_status,
                        census_conducted_at,
                        census_conducted_by,
                        justice_rendered_by,
                        population_total,
                        population_total_females,
                        population_couples,
                        population_minors,
                        population_minors_girls,
                        population_minors_0_3,
                        population_minors_3_6,
                        population_minors_6_12,
                        population_minors_12_16,
                        population_minors_16_18,
                        minors_in_school,
                        caravans,
                        huts,
                        tents,
                        cars,
                        mattresses,
                        living_conditions_version,
                        fk_electricity_type,
                        electricity_comments,
                        access_to_water,
                        water_comments,
                        water_potable,
                        water_continuous_access,
                        water_public_point,
                        water_distance,
                        water_roads_to_cross,
                        water_everyone_has_access,
                        water_stagnant_water,
                        water_hand_wash_access,
                        water_hand_wash_access_number,
                        trash_evacuation,
                        trash_cans_on_site,
                        trash_accumulation,
                        trash_evacuation_regular,
                        vermin,
                        vermin_comments,
                        fire_prevention_measures,
                        fire_prevention_diagnostic,
                        fire_prevention_site_accessible,
                        fire_prevention_devices,
                        fire_prevention_comments,
                        access_to_sanitary,
                        sanitary_comments,
                        sanitary_number,
                        sanitary_insalubrious,
                        sanitary_on_site,
                        water_access_type,
                        water_access_type_details,
                        water_access_is_public,
                        water_access_is_continuous,
                        water_access_is_continuous_details,
                        water_access_is_local,
                        water_access_is_close,
                        water_access_is_unequal,
                        water_access_is_unequal_details,
                        water_access_has_stagnant_water,
                        water_access_comments,
                        sanitary_access_open_air_defecation,
                        sanitary_access_working_toilets,
                        sanitary_access_toilets_are_inside,
                        sanitary_access_toilets_are_lighted,
                        sanitary_access_hand_washing,
                        electricity_access,
                        electricity_access_is_unequal,
                        trash_is_piling,
                        trash_evacuation_is_close,
                        trash_evacuation_is_safe,
                        trash_evacuation_is_regular,
                        trash_bulky_is_piling,
                        pest_animals,
                        pest_animals_details,
                        fire_prevention,
                        owner_complaint,
                        justice_procedure,
                        justice_rendered,
                        justice_rendered_at,
                        justice_challenged,
                        police_status,
                        police_requested_at,
                        police_granted_at,
                        bailiff,
                        existing_litigation,
                        evacuation_under_time_limit,
                        administrative_order_decision_at,
                        administrative_order_decision_rendered_by,
                        administrative_order_evacuation_at,
                        insalubrity_order,
                        insalubrity_order_displayed,
                        insalubrity_order_type,
                        insalubrity_order_by,
                        insalubrity_order_at,
                        insalubrity_parcels,
                        closed_with_solutions,
                        resorption_target,
                        created_at,
                        created_by,
                        updated_at,
                        updated_by,
                        "archivedAt"
                    )
                SELECT
                    shantytown_id,
                    updated_without_any_change,
                    status,
                    closing_context,
                    name,
                    latitude,
                    longitude,
                    address,
                    address_details,
                    fk_city,
                    built_at,
                    declared_at,
                    closed_at,
                    fk_field_type,
                    owner,
                    fk_owner_type,
                    is_reinstallation,
                    reinstallation_comments,
                    census_status::text::"enum_ShantytownHistories_census_status",
                    census_conducted_at,
                    census_conducted_by,
                    justice_rendered_by,
                    population_total,
                    population_total_females,
                    population_couples,
                    population_minors,
                    population_minors_girls,
                    population_minors_0_3,
                    population_minors_3_6,
                    population_minors_6_12,
                    population_minors_12_16,
                    population_minors_16_18,
                    minors_in_school,
                    caravans,
                    huts,
                    tents,
                    cars,
                    mattresses,
                    living_conditions_version,
                    fk_electricity_type,
                    electricity_comments,
                    access_to_water,
                    water_comments,
                    water_potable,
                    water_continuous_access,
                    water_public_point,
                    water_distance::text::"enum_ShantytownHistories_water_distance",
                    water_roads_to_cross,
                    water_everyone_has_access,
                    water_stagnant_water,
                    water_hand_wash_access,
                    water_hand_wash_access_number,
                    trash_evacuation,
                    trash_cans_on_site,
                    trash_accumulation,
                    trash_evacuation_regular,
                    vermin,
                    vermin_comments,
                    fire_prevention_measures,
                    fire_prevention_diagnostic,
                    fire_prevention_site_accessible,
                    fire_prevention_devices,
                    fire_prevention_comments,
                    access_to_sanitary,
                    sanitary_comments,
                    sanitary_number,
                    sanitary_insalubrious,
                    sanitary_on_site,
                    water_access_type::text::"enum_ShantytownHistories_water_access_type",
                    water_access_type_details,
                    water_access_is_public,
                    water_access_is_continuous,
                    water_access_is_continuous_details,
                    water_access_is_local,
                    water_access_is_close,
                    water_access_is_unequal,
                    water_access_is_unequal_details,
                    water_access_has_stagnant_water,
                    water_access_comments,
                    sanitary_access_open_air_defecation,
                    sanitary_access_working_toilets,
                    sanitary_access_toilets_are_inside,
                    sanitary_access_toilets_are_lighted,
                    sanitary_access_hand_washing,
                    electricity_access,
                    electricity_access_is_unequal,
                    trash_is_piling,
                    trash_evacuation_is_close,
                    trash_evacuation_is_safe,
                    trash_evacuation_is_regular,
                    trash_bulky_is_piling,
                    pest_animals,
                    pest_animals_details,
                    fire_prevention,
                    owner_complaint,
                    justice_procedure,
                    justice_rendered,
                    justice_rendered_at,
                    justice_challenged,
                    police_status::text::"enum_ShantytownHistories_police_status",
                    police_requested_at,
                    police_granted_at,
                    bailiff,
                    existing_litigation,
                    evacuation_under_time_limit,
                    administrative_order_decision_at,
                    administrative_order_decision_rendered_by,
                    administrative_order_evacuation_at,
                    insalubrity_order,
                    insalubrity_order_displayed,
                    insalubrity_order_type,
                    insalubrity_order_by,
                    insalubrity_order_at,
                    insalubrity_parcels,
                    closed_with_solutions,
                    resorption_target,
                    created_at,
                    created_by,
                    updated_at,
                    updated_by,
                    NOW()
                FROM shantytowns WHERE shantytown_id = :id
                RETURNING hid`,
            {
                replacements: {
                    id: shantytownId,
                },
                transaction,
            },
        );

        await Promise.all([
            sequelize.query(
                `INSERT INTO
                        "ShantytownOriginHistories"(
                            fk_shantytown,
                            fk_social_origin,
                            created_at,
                            updated_at,
                            "archivedAt"
                        )
                    SELECT
                        :hid,
                        fk_social_origin,
                        created_at,
                        updated_at,
                        NOW()
                    FROM shantytown_origins WHERE fk_shantytown = :id`,
                {
                    replacements: {
                        hid,
                        id: shantytownId,
                    },
                    transaction,
                },
            ),
            sequelize.query(
                `INSERT INTO
                        "shantytown_toilet_types_history"(
                            fk_shantytown,
                            toilet_type,
                            created_at,
                            archived_at
                        )
                    SELECT
                        :hid,
                        toilet_type::text::"enum_shantytown_toilet_types_history_toilet_type",
                        created_at,
                        NOW()
                    FROM shantytown_toilet_types WHERE fk_shantytown = :id`,
                {
                    replacements: {
                        hid,
                        id: shantytownId,
                    },
                    transaction,
                },
            ),
            sequelize.query(
                `INSERT INTO
                    "electricity_access_types_history"(
                        fk_shantytown,
                        electricity_access_type,
                        created_at,
                        archived_at
                    )
                SELECT
                    :hid,
                    electricity_access_type::text::"enum_electricity_access_types_history_electricity_access_type",
                    created_at,
                    NOW()
                FROM electricity_access_types WHERE fk_shantytown = :id`,
                {
                    replacements: {
                        hid,
                        id: shantytownId,
                    },
                    transaction,
                },
            ),
            sequelize.query(
                `INSERT INTO
                    "shantytown_resorption_phases_history"(
                        fk_shantytown,
                        fk_preparatory_phase,
                        created_at,
                        completed_at,
                        archived_at
                    )
                SELECT
                    :hid,
                    fk_preparatory_phase,
                    created_at,
                    completed_at,
                    NOW()
                FROM shantytown_preparatory_phases_toward_resorption WHERE fk_shantytown = :id`,
                {
                    replacements: {
                        hid,
                        id: shantytownId,
                    },
                    transaction,
                },
            ),
        ]);

        // now, update the shantytown
        const accessKeys: string[] = ['owner'];
        const justiceKeys: string[] = [
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
            'existing_litigation',
            'evacuation_under_time_limit',
            'administrative_order_decision_at',
            'administrative_order_decision_rendered_by',
            'administrative_order_evacuation_at',
            'insalubrity_order',
            'insalubrity_order_displayed',
            'insalubrity_order_type',
            'insalubrity_order_by',
            'insalubrity_order_at',
            'insalubrity_parcels',
            'attachments',
        ];
        const { commonData, justiceData, ownerData } = Object.keys(data).reduce(
            (acc, key) => {
                if ([
                    'social_origins',
                    'closing_solutions',
                    'sanitary_toilet_types',
                    'electricity_access_types',
                    'reinstallation_incoming_towns',
                    'preparatory_phases',
                ].includes(key)) {
                    return acc;
                }

                if (justiceKeys.includes(key)) {
                    return {
                        commonData: acc.commonData,
                        justiceData: {
                            ...acc.justiceData,
                            ...(data[key] !== undefined ? { [key]: data[key] } : {}),
                        },
                        ownerData: acc.ownerData,
                    };
                }

                if (accessKeys.includes(key)) {
                    return {
                        commonData: acc.commonData,
                        justiceData: acc.justiceData,
                        ownerData: {
                            ...acc.ownerData,
                            [key]: data[key],
                        },
                    };
                }

                return {
                    commonData: {
                        ...acc.commonData,
                        ...(data[key] !== undefined ? { [key]: data[key] } : {}),
                    },
                    justiceData: acc.justiceData,
                    ownerData: acc.ownerData,
                };
            },
            { commonData: {}, justiceData: {}, ownerData: {} },
        );

        const updatedTown = {
            ...commonData,
            updated_by: editor.id,
            ...(editor.isAllowedTo('access', 'shantytown_justice') ? justiceData : {}),
            ...(editor.isAllowedTo('access', 'shantytown_owner') ? ownerData : {}),
        };

        await sequelize.query(
            `UPDATE shantytowns
                SET
                    ${Object.keys(updatedTown).map(column => `${column} = :${column}`).join(', ')}
                WHERE shantytown_id = :id`,
            {
                replacements: Object.assign(updatedTown, {
                    id: shantytownId,
                }),
                transaction,
            },
        );

        if (Array.isArray(data.reinstallation_incoming_towns)) {
            await sequelize.query(
                'DELETE FROM shantytown_incoming_towns WHERE fk_shantytown = :id',
                {
                    replacements: { id: shantytownId },
                    transaction,
                },
            );

            if (data.reinstallation_incoming_towns.length > 0) {
                await incomingTownsModel.create(
                    shantytownId,
                    data.reinstallation_incoming_towns,
                    transaction,
                );
            }
        }

        if (Array.isArray(data.social_origins)) {
            await sequelize.query(
                'DELETE FROM shantytown_origins WHERE fk_shantytown = :id',
                {
                    replacements: {
                        id: shantytownId,
                    },
                    transaction,
                },
            );

            if (data.social_origins.length > 0) {
                await sequelize.query(
                    `INSERT INTO
                            shantytown_origins(fk_shantytown, fk_social_origin)
                        VALUES
                            ${data.social_origins.map(() => '(?, ?)').join(', ')}`,
                    {
                        replacements: data.social_origins.reduce((arr, origin) => [
                            ...arr,
                            shantytownId,
                            origin,
                        ], []),
                        transaction,
                    },
                );
            }
        }

        if (Array.isArray(data.sanitary_toilet_types)) {
            await sequelize.query(
                'DELETE FROM shantytown_toilet_types WHERE fk_shantytown = :id',
                {
                    replacements: {
                        id: shantytownId,
                    },
                    transaction,
                },
            );

            if (data.sanitary_toilet_types.length > 0) {
                await sequelize.query(
                    `INSERT INTO
                        shantytown_toilet_types(fk_shantytown, toilet_type)
                        VALUES
                            ${data.sanitary_toilet_types.map(() => '(?, ?)').join(', ')}`,
                    {
                        replacements: data.sanitary_toilet_types.reduce((arr, toiletType) => [
                            ...arr,
                            shantytownId,
                            toiletType,
                        ], []),
                        transaction,
                    },
                );
            }
        }

        if (Array.isArray(data.electricity_access_types)) {
            await sequelize.query(
                'DELETE FROM electricity_access_types WHERE fk_shantytown = :id',
                {
                    replacements: {
                        id: shantytownId,
                    },
                    transaction,
                },
            );

            if (data.electricity_access_types.length > 0) {
                await sequelize.query(
                    `INSERT INTO
                        electricity_access_types(fk_shantytown, electricity_access_type)
                        VALUES
                            ${data.electricity_access_types.map(() => '(?, ?)').join(', ')}`,
                    {
                        replacements: data.electricity_access_types.reduce((arr, accessType) => [
                            ...arr,
                            shantytownId,
                            accessType,
                        ], []),
                        transaction,
                    },
                );
            }
        }

        if (Array.isArray(data.closing_solutions)) {
            await sequelize.query(
                'DELETE FROM shantytown_closing_solutions WHERE fk_shantytown = :id',
                {
                    replacements: {
                        id: shantytownId,
                    },
                    transaction,
                },
            );

            if (data.closing_solutions.length > 0) {
                await sequelize.query(
                    `INSERT INTO
                            shantytown_closing_solutions(fk_shantytown, fk_closing_solution, number_of_people_affected, number_of_households_affected, message)
                        VALUES
                            ${data.closing_solutions.map(() => '(?, ?, ?, ?, ?)').join(', ')}`,
                    {
                        replacements: data.closing_solutions.reduce((arr, solution) => [
                            ...arr,
                            shantytownId,
                            solution.id,
                            solution.people_affected,
                            solution.households_affected,
                            solution.message,
                        ], []),
                        transaction,
                    },
                );
            }
        }

        // Note: Les phases préparatoires sont gérées par shantytownResorptionService.update()
        // et non ici. On garde juste 'preparatory_phases' dans la liste des clés exclues (ligne 402)
        // pour éviter qu'il soit traité comme un champ normal du shantytown.

        if (argTransaction === undefined) {
            await transaction.commit();
        }

        return hid;
    } catch (error) {
        if (argTransaction === undefined) {
            await transaction.rollback();
        }

        throw error;
    }
};
