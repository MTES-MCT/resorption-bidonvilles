const { sequelize } = require('#db/models');

module.exports = async (editor, shantytownId, data, argTransaction = undefined) => {
    let transaction = argTransaction;
    if (transaction === undefined) {
        transaction = await sequelize.transaction();
    }

    // save the current state of the shantytown
    const [[{ hid }]] = await sequelize.query(
        `INSERT INTO
                "ShantytownHistories"(
                    shantytown_id,
                    status,
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
                    census_status,
                    census_conducted_at,
                    census_conducted_by,
                    justice_rendered_by,
                    population_total,
                    population_couples,
                    population_minors,
                    population_minors_0_3,
                    population_minors_3_6,
                    population_minors_6_12,
                    population_minors_12_16,
                    population_minors_16_18,
                    minors_in_school,
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
                    owner_complaint,
                    justice_procedure,
                    justice_rendered,
                    justice_rendered_at,
                    justice_challenged,
                    police_status,
                    police_requested_at,
                    police_granted_at,
                    bailiff,
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
                status,
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
                census_status::text::"enum_ShantytownHistories_census_status",
                census_conducted_at,
                census_conducted_by,
                justice_rendered_by,
                population_total,
                population_couples,
                population_minors,
                population_minors_0_3,
                population_minors_3_6,
                population_minors_6_12,
                population_minors_12_16,
                population_minors_16_18,
                minors_in_school,
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
                owner_complaint,
                justice_procedure,
                justice_rendered,
                justice_rendered_at,
                justice_challenged,
                police_status::text::"enum_ShantytownHistories_police_status",
                police_requested_at,
                police_granted_at,
                bailiff,
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
                    "ShantytownClosingSolutionHistories"(
                        fk_shantytown,
                        fk_closing_solution,
                        number_of_people_affected,
                        number_of_households_affected,
                        created_at,
                        updated_at,
                        "archivedAt"
                    )
                SELECT
                    :hid,
                    fk_closing_solution,
                    number_of_people_affected,
                    number_of_households_affected,
                    created_at,
                    updated_at,
                    NOW()
                FROM shantytown_closing_solutions WHERE fk_shantytown = :id`,
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
    const accessKeys = ['owner'];
    const justiceKeys = [
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
    const { commonData, justiceData, ownerData } = Object.keys(data).reduce(
        (acc, key) => {
            if (['social_origins', 'closing_solutions'].includes(key)) { // ignore social_origins, they are a special case
                return acc;
            }

            if (justiceKeys.includes(key)) {
                return {
                    commonData: acc.commonData,
                    justiceData: {
                        ...acc.justiceData,
                        [key]: data[key],
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
                    [key]: data[key],
                },
                justiceData: acc.justiceData,
                ownerData: acc.ownerData,
            };
        },
        { commonData: {}, justiceData: {}, ownerData: {} },
    );

    const updatedTown = Object.assign(
        commonData,
        {
            updated_by: editor.id,
            updated_at: new Date(),
        },
        editor.isAllowedTo('access', 'shantytown_justice')
            ? justiceData
            : {},
        editor.isAllowedTo('access', 'shantytown_owner')
            ? ownerData
            : {},
    );

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
                        shantytown_closing_solutions(fk_shantytown, fk_closing_solution, number_of_people_affected, number_of_households_affected)
                    VALUES
                        ${data.closing_solutions.map(() => '(?, ?, ?, ?)').join(', ')}`,
                {
                    replacements: data.closing_solutions.reduce((arr, solution) => [
                        ...arr,
                        shantytownId,
                        solution.id,
                        solution.people_affected,
                        solution.households_affected,
                    ], []),
                    transaction,
                },
            );
        }
    }

    if (argTransaction === undefined) {
        await transaction.commit();
    }
};
