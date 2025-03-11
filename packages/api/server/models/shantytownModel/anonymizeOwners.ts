import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';

export default async (argTransaction: Transaction = undefined): Promise<void> => {
    let transaction: Transaction = argTransaction;
    if (transaction === undefined) {
        transaction = await sequelize.transaction();
    }
    try {
        sequelize.query(`
            UPDATE shantytowns SET owner = NULL 
            WHERE status NOT LIKE 'open' 
            AND fk_owner_type = 3 
            AND "owner" IS NOT NULL
            AND closed_at < CURRENT_DATE - INTERVAL '1 year'`,
        {
            type: QueryTypes.UPDATE,
            transaction,
        });
        sequelize.query(`
            UPDATE "ShantytownHistories"  
            SET owner = NULL
            WHERE status NOT LIKE 'open' 
            AND fk_owner_type = 3 
            AND "owner" IS NOT NULL
            AND closed_at < CURRENT_DATE - INTERVAL '1 year'`,
        {
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
