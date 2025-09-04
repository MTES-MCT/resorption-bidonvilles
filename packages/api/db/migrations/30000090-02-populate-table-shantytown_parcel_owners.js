module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query(
                `INSERT INTO shantytown_parcel_owners(fk_shantytown, fk_user, owner_name, fk_owner_type)
                SELECT
                    shantytowns.shantytown_id,
                    shantytowns.created_by,
                    shantytowns.owner,
                    shantytowns.fk_owner_type
                FROM shantytowns
                WHERE shantytowns.fk_owner_type IS NOT NULL AND shantytowns.status = 'open'`,
                { transaction },
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.sequelize.query('DELETE FROM shantytown_parcel_owners', { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
