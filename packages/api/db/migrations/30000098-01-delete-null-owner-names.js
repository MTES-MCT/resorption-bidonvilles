function deleteNullOwnerNames(queryInterface, tableName, transaction) {
    return queryInterface.sequelize.query(
        `
            DELETE FROM ${tableName}
            WHERE fk_owner_type = 1 AND owner_name IS NULL
        `,
        { transaction },
    );
}

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await deleteNullOwnerNames(queryInterface, 'shantytown_parcel_owners', transaction);
            await deleteNullOwnerNames(queryInterface, 'shantytown_parcel_owners_history', transaction);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down() {
        // Irreversible data cleanup
    },
};
