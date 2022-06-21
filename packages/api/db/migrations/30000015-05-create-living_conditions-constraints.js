const OLD_FIELDS = [
    // electricity
    'fk_electricity_type', 'electricity_comments',
    // water
    'access_to_water', 'water_comments', 'water_potable', 'water_continuous_access',
    'water_public_point', 'water_distance', 'water_roads_to_cross',
    'water_everyone_has_access', 'water_stagnant_water', 'water_hand_wash_access',
    'water_hand_wash_access_number',
    // sanitary
    'access_to_sanitary', 'sanitary_comments', 'sanitary_number', 'sanitary_insalubrious',
    'sanitary_on_site',
    // trash
    'trash_evacuation', 'trash_cans_on_site', 'trash_accumulation', 'trash_evacuation_regular',
    // vermin
    'vermin', 'vermin_comments',
    // fire prevention
    'fire_prevention_measures', 'fire_prevention_diagnostic', 'fire_prevention_site_accessible',
    'fire_prevention_devices', 'fire_prevention_comments',
];
const NEW_FIELDS = [
    // electricity
    'electricity_access', 'electricity_access_is_unequal',
    // water
    'water_access_type', 'water_access_type_details', 'water_access_is_public',
    'water_access_is_continuous', 'water_access_is_continuous_details', 'water_access_is_local',
    'water_access_is_close', 'water_access_is_unequal', 'water_access_is_unequal_details',
    'water_access_has_stagnant_water', 'water_access_comments',
    // sanitary
    'sanitary_access_open_air_defecation', 'sanitary_access_working_toilets',
    'sanitary_access_toilets_are_inside', 'sanitary_access_toilets_are_lighted',
    'sanitary_access_hand_washing',
    // trash
    'trash_is_piling', 'trash_evacuation_is_close', 'trash_evacuation_is_safe',
    'trash_evacuation_is_regular', 'trash_bulky_is_piling',
    // pest animals
    'pest_animals', 'pest_animals_details',
    // fire prevention
    'fire_prevention',
];

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addConstraint(
        'shantytowns',
        ['living_conditions_version', ...OLD_FIELDS, ...NEW_FIELDS],
        {
            type: 'check',
            name: 'check_living_conditions_versioning',
            where: {
                [Sequelize.Op.or]: [
                    // version 1 => tous les champs V2 doivent être à NULL
                    {
                        [Sequelize.Op.and]: {
                            living_conditions_version: { [Sequelize.Op.eq]: 1 },
                            ...NEW_FIELDS.reduce((acc, field) => ({
                                ...acc,
                                [field]: { [Sequelize.Op.eq]: null },
                            }), {}),
                        },
                    },
                    // version 2 => tous les champs V1 doivent être à NULL
                    {
                        [Sequelize.Op.and]: {
                            living_conditions_version: { [Sequelize.Op.eq]: 2 },
                            ...OLD_FIELDS.reduce((acc, field) => ({
                                ...acc,
                                [field]: { [Sequelize.Op.eq]: null },
                            }), {}),
                        },
                    },
                ],
            },
        },
    ),

    down: queryInterface => queryInterface.removeConstraint('shantytowns', 'check_living_conditions_versioning'),
};
