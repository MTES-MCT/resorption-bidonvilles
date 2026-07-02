const values = [
    { uid: 'sociological_diagnosis', oldName: 'Réalisé le', newName: 'Réalisé' },
    { uid: 'social_assessment', oldName: 'Réalisée le', newName: 'Réalisée' },
    { uid: 'political_validation', oldName: 'Obtenue le', newName: 'Obtenue' },
    { uid: 'contract_preparation', oldName: 'Finalisée le', newName: 'Finalisée' },
    { uid: 'land_equipment_development', oldName: 'Terminé le', newName: 'Terminé' },
    { uid: 'family_information', oldName: 'Réalisée le', newName: 'Réalisée' },
    { uid: 'contractualization_of_families', oldName: 'Terminée le', newName: 'Terminée' },
    { uid: 'official_opening', oldName: 'Le', newName: 'Le' },
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
            const promises = values.map(({ uid, newName }) => updateDateLabel(queryInterface, Sequelize, uid, newName, transaction));
            await Promise.all(promises);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            const promises = values.map(({ uid, oldName }) => updateDateLabel(queryInterface, Sequelize, uid, oldName, transaction));
            await Promise.all(promises);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
