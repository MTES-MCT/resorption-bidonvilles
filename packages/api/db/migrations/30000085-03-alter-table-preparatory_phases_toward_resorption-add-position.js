const values = [
    { uid: 'sociological_diagnosis', position: 1 },
    { uid: 'social_assessment', position: 2 },
    { uid: 'political_validation', position: 3 },
    { uid: 'contract_preparation', position: 4 },
    { uid: 'land_equipment_development', position: 5 },
    { uid: 'family_information', position: 6 },
    { uid: 'contractualization_of_families', position: 7 },
    { uid: 'official_opening', position: 8 },
];

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.addColumn(
                'preparatory_phases_toward_resorption',
                'position',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                { transaction },
            );

            const promises = values.map(({ uid, position }) => queryInterface.bulkUpdate(
                'preparatory_phases_toward_resorption',
                {
                    position,
                },
                {
                    uid: {
                        [Sequelize.Op.eq]: uid,
                    },
                },
                { transaction },
            ));
            await Promise.all(promises);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.removeColumn(
                'preparatory_phases_toward_resorption',
                'position',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
