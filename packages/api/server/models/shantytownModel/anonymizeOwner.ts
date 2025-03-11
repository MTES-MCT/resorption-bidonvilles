import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';

export default async (shantytownId: number, argTransaction: Transaction = undefined): Promise<void> => {
    let transaction: Transaction = argTransaction;
    if (transaction === undefined) {
        transaction = await sequelize.transaction();
    }
    try {
        sequelize.query(`UPDATE shantytowns SET owner = NULL 
            WHERE shantytown_id = :id`,
        {
            replacements: {
                id: shantytownId,
            },
            type: QueryTypes.UPDATE,
            transaction,
        });
        sequelize.query(`UPDATE "ShantytownHistories"  SET owner = NULL
            WHERE shantytown_id = :id`,
        {
            replacements: {
                id: shantytownId,
            },
            type: QueryTypes.UPDATE,
            transaction,
        });
        if (argTransaction === undefined) {
            await transaction.commit();
        }
    } catch (error) {
        if (argTransaction === undefined) {
            await transaction.rollback();
        }
        throw error;
    }
};
