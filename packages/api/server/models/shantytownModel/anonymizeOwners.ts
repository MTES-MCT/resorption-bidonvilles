import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';

export default async (argTransaction: Transaction = undefined): Promise<{ shantytownLines: number, shantytownHistoryLines: number }> => {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();

    let shantytownResult: any[] | number = [];
    let historyResult: any[] | number = [];

    const factorizedQuery = (type: string | null): string => `
            UPDATE ${type === 'history' ? 'shantytown_parcel_owners_history' : 'shantytown_parcel_owners'} 
            SET owner_name = 'Anonymisé le ' || TO_CHAR(CURRENT_TIMESTAMP, 'DD/MM/YYYY à HH24:MI')
            WHERE fk_owner_type = 3 
            AND owner_name IS NOT NULL
            AND owner_name != ''
            AND owner_name NOT ILIKE 'Anonymisé le %'
            AND fk_shantytown IN (
                SELECT ${type === 'history' ? 'hid' : 'shantytown_id'} 
                FROM ${type === 'history' ? '"ShantytownHistories"' : 'shantytowns'} 
                WHERE status NOT LIKE 'open' 
                AND closed_at < CURRENT_DATE - INTERVAL '1 year'
            )
            RETURNING shantytown_parcel_owner_id`;

    try {
        // Anonymiser les propriétaires privés (type 3) dans shantytown_parcel_owners
        [shantytownResult] = await sequelize.query(factorizedQuery(null),
            {
                type: QueryTypes.UPDATE,
                transaction,
            });

        // Anonymiser les propriétaires privés (type 3) dans shantytown_parcel_owners_history
        [historyResult] = await sequelize.query(factorizedQuery('history'),
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
