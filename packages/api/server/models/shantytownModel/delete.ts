import { sequelize } from '#db/sequelize';

export default async (id) => {
    const transaction = await sequelize.transaction();
    try {
        await sequelize.query(
            'DELETE FROM shantytowns WHERE shantytown_id = :id',
            {
                transaction,
                replacements: {
                    id,
                },
            },
        );
        await sequelize.query(
            'DELETE FROM "ShantytownHistories" WHERE shantytown_id = :id',
            {
                transaction,
                replacements: {
                    id,
                },
            },
        );

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
