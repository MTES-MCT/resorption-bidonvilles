function getColumns(Sequelize) {
    return {
        // water
        water_access_type: {
            type: Sequelize.ENUM('fontaine_publique', 'borne_incendie', 'achat_bouteille', 'reservoir', 'robinet_connecte_au_reseau', 'autre'),
            allowNull: true,
        },
        water_access_type_details: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        water_access_is_public: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        water_access_is_continuous: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        water_access_is_continuous_details: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        water_access_is_local: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        water_access_is_close: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        water_access_is_unequal: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        water_access_is_unequal_details: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        water_access_has_stagnant_water: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        water_access_comments: {
            type: Sequelize.STRING,
            allowNull: true,
        },

        // sanitary
        sanitary_access_open_air_defecation: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        sanitary_access_working_toilets: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        sanitary_access_toilets_are_inside: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        sanitary_access_toilets_are_lighted: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        sanitary_access_hand_washing: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },

        // electricity
        electricity_access: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        electricity_access_is_unequal: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },

        // trash
        trash_is_piling: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        trash_evacuation_is_close: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        trash_evacuation_is_safe: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        trash_evacuation_is_regular: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        trash_bulky_is_piling: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },

        // pest animals
        pest_animals: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        pest_animals_details: {
            type: Sequelize.TEXT,
            allowNull: true,
        },

        // fire prevention
        fire_prevention: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
    };
}

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        const columns = getColumns(Sequelize);

        await Promise.all([
            ...Object.keys(columns)
                .map(columnName => queryInterface.addColumn(
                    'shantytowns',
                    columnName,
                    columns[columnName],
                    { transaction },
                )),
            ...Object.keys(columns)
                .map(columnName => queryInterface.addColumn(
                    'ShantytownHistories',
                    columnName,
                    columns[columnName],
                    { transaction },
                )),
        ]);

        await transaction.commit();
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        const columns = getColumns(Sequelize);

        // create a new column
        await Promise.all([
            ...Object.keys(columns)
                .map(columnName => queryInterface.removeColumn(
                    'shantytowns',
                    columnName,
                    { transaction },
                )),
            ...Object.keys(columns)
                .map(columnName => queryInterface.removeColumn(
                    'ShantytownHistories',
                    columnName,
                    { transaction },
                )),
        ]);
        await Promise.all([
            queryInterface.sequelize.query(
                'DROP TYPE "enum_shantytowns_water_access_type"',
                { transaction },
            ),
            queryInterface.sequelize.query(
                'DROP TYPE "enum_ShantytownHistories_water_access_type"',
                { transaction },
            ),
        ]);

        await transaction.commit();
    },
};
