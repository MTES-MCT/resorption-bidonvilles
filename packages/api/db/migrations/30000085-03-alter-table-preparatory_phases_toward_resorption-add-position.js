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


async function updatePosition(queryInterface, Sequelize, uid, position, transaction) {
    return queryInterface.bulkUpdate(
        'preparatory_phases_toward_resorption',
        { position },
        { uid: { [Sequelize.Op.eq]: uid } },
        { transaction },
    );
}

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

            const promises = values.map(({ uid, position }) => updatePosition(queryInterface, Sequelize, uid, position, transaction));

            await Promise.all(promises);
            await transaction.commit();
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

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
