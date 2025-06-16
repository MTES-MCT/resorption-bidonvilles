const values = [
    { uid: 'contract_preparation', name: 'Finalisé le' },
    { uid: 'land_equipment_development', name: 'Terminé le' },
    { uid: 'family_information', name: 'Réalisée le' },
    { uid: 'contractualization_of_families', name: 'Terminée le' },
    { uid: 'official_opening', name: 'Le' },
    { uid: 'sociological_diagnosis', name: 'Réalisé le' },
    { uid: 'social_assessment', name: 'Réalisée le' },
    { uid: 'political_validation', name: 'Obtenue le' },
];


async function updateDateLabel(queryInterface, Sequelize, uid, name, transaction) {
    return queryInterface.bulkUpdate(
        'preparatory_phases_toward_resorption',
        { date_label: name },
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
                'date_label',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: '',
                },
                { transaction },
            );

            const promises = values.map(({ uid, name }) => updateDateLabel(queryInterface, Sequelize, uid, name, transaction));

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
                'date_label',
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
