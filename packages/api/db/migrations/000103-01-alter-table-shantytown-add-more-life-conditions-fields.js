const getFields = Sequelize => ({
    // WATER FIELDS
    water_potable: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    water_continuous_access: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    water_public_point: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    water_distance: {
        type: Sequelize.ENUM('0-20', '20-50', '50-100', '100+'),
        allowNull: true,
    },
    water_roads_to_cross: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    water_everyone_has_access: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    water_stagnant_water: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    water_hand_wash_access: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    water_hand_wash_access_number: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    // SANITARY FIELDS
    sanitary_number: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    sanitary_insalubrious: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    sanitary_on_site: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    // TRASH EVACUATION
    trash_cans_on_site: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    trash_accumulation: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    trash_evacuation_regular: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    // VERMIN
    vermin: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    vermin_comments: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    // FIRE PREVENTION
    fire_prevention_measures: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    fire_prevention_diagnostic: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    fire_prevention_site_accessible: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    fire_prevention_devices: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    fire_prevention_comments: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
});

const addWaterAndWashAccessNumberConstraint = ({ queryInterface, Sequelize, transaction }) => queryInterface.addConstraint(
    'shantytowns',
    ['water_hand_wash_access_number'],
    {
        type: 'check',
        name: 'water_hand_wash_access_number_only_defined_if_access_true',
        where: {
            [Sequelize.Op.or]: {
                [Sequelize.Op.and]: {
                    water_hand_wash_access: { [Sequelize.Op.ne]: true },
                    water_hand_wash_access_number: { [Sequelize.Op.eq]: null },
                },
                water_hand_wash_access: { [Sequelize.Op.eq]: true },
            },
        },
        transaction,
    },
);

const addPositiveConstraint = ({
    queryInterface, Sequelize, transaction, field,
}) => queryInterface.addConstraint(
    'shantytowns',
    [field],
    {
        type: 'check',
        name: `${field}_positive_or_null`,
        where: {
            [Sequelize.Op.or]: [
                {
                    [field]: { [Sequelize.Op.eq]: null },
                },
                {
                    [field]: { [Sequelize.Op.gt]: 0 },
                },
            ],
        },
        transaction,
    },
);

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            ...Object.entries(getFields(Sequelize)).flatMap(([field, props]) => [
                queryInterface.addColumn(
                    'shantytowns',
                    field,
                    props,
                    {
                        transaction,
                    },
                ),
                queryInterface.addColumn(
                    'ShantytownHistories',
                    field,
                    props,
                    {
                        transaction,
                    },
                ),
            ]),
            addWaterAndWashAccessNumberConstraint({ queryInterface, Sequelize, transaction }),
            addPositiveConstraint({
                queryInterface, Sequelize, transaction, field: 'water_hand_wash_access_number',
            }),
            addPositiveConstraint({
                queryInterface, Sequelize, transaction, field: 'sanitary_number',
            }),
            addPositiveConstraint({
                queryInterface, Sequelize, transaction, field: 'trash_cans_on_site',
            }),
        ]),
    ),
    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.removeConstraint('shantytowns', 'water_hand_wash_access_number_only_defined_if_access_true', { transaction }),
            queryInterface.removeConstraint('shantytowns', 'water_hand_wash_access_number_positive_or_null', { transaction }),
            queryInterface.removeConstraint('shantytowns', 'sanitary_number_positive_or_null', { transaction }),
            queryInterface.removeConstraint('shantytowns', 'trash_cans_on_site_positive_or_null', { transaction }),
            ...Object.keys(getFields(Sequelize)).flatMap(field => [
                queryInterface.removeColumn(
                    'shantytowns',
                    field,
                    {
                        transaction,
                    },
                ),
                queryInterface.removeColumn(
                    'ShantytownHistories',
                    field,
                    {
                        transaction,
                    },
                ),

            ])]),
    ).then(() => Promise.all([
        queryInterface.sequelize.query('DROP TYPE "enum_shantytowns_water_distance"'),
        queryInterface.sequelize.query('DROP TYPE "enum_ShantytownHistories_water_distance"'),
    ])),
};
