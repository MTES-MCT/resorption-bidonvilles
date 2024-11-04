module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.createTable(
            'preparatory_phases_toward_resorption',
            {
                uid: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
            },
            {
                transaction,
            },
        );

        await queryInterface.bulkInsert(
            'preparatory_phases_toward_resorption',
            [
                {
                    uid: 'sociological_diagnosis',
                    name: 'Diagnostique sociologique',
                },
                {
                    uid: 'social_assessment',
                    name: 'Evaluation sociale',
                },
                {
                    uid: 'political_validation',
                    name: 'Validation politique',
                },
                {
                    uid: 'contract_preparation',
                    name: 'Préparation conventionnement',
                },
                {
                    uid: 'land_equipment_development',
                    name: 'Aménagement équipement terrain',
                },
                {
                    uid: 'family_information',
                    name: 'Information des familles',
                },
                {
                    uid: 'contractualization_of_families',
                    name: 'Contractualisation des familles',
                },
                {
                    uid: 'official_opening',
                    name: 'Ouverture officielle',
                },
            ],
            {
                transaction,
            },
        );
        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.dropTable('preparatory_phases_toward_resorption', { transaction });
        return transaction.commit();
    },
};
