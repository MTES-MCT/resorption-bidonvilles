import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';

export default async (argTransaction: Transaction = undefined): Promise<{ shantytownLines: number, shantytownHistoryLines: number }> => {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();

    let shantytownResult: any[] | number = [];
    let historyResult: any[] | number = [];

    try {
        [shantytownResult] = await sequelize.query(`
            UPDATE shantytowns SET owner = 'Anonymisé le ' || TO_CHAR(CURRENT_TIMESTAMP,  'DD/MM/YYYY à HH24:MI')
            WHERE status NOT LIKE 'open' 
            AND fk_owner_type = 3 
            AND "owner" IS NOT NULL
            AND "owner" != ''
            AND owner NOT ILIKE 'Anonymisé le %'
            AND closed_at < CURRENT_DATE - INTERVAL '1 year'
            RETURNING shantytown_id`,
        {
            type: QueryTypes.UPDATE,
            transaction,
        });

        [historyResult] = await sequelize.query(`
            UPDATE "ShantytownHistories"  
            SET owner = 'Anonymisé le ' || TO_CHAR(CURRENT_TIMESTAMP,  'DD/MM/YYYY à HH24:MI')
            WHERE status NOT LIKE 'open' 
            AND fk_owner_type = 3 
            AND "owner" IS NOT NULL
            AND "owner" != ''
            AND owner NOT ILIKE 'Anonymisé le %'
            AND closed_at < CURRENT_DATE - INTERVAL '1 year'
            RETURNING shantytown_id`,
        {
            type: QueryTypes.UPDATE,
            transaction,
        });

        let shantytownLines = 0;
        let shantytownHistoryLines = 0;

        if (Array.isArray(shantytownResult)) {
            shantytownLines = shantytownResult.length;
        } else if (typeof shantytownResult === 'number') {
            shantytownLines = shantytownResult;
        }

        if (Array.isArray(historyResult)) {
            shantytownHistoryLines = historyResult.length;
        } else if (typeof historyResult === 'number') {
            shantytownHistoryLines = historyResult;
        }

        if (argTransaction === undefined) {
            await transaction.commit();
        }

        return { shantytownLines, shantytownHistoryLines };
    } catch (error) {
        if (argTransaction === undefined) {
            await transaction.rollback();
        }
        throw error;
    }
};
