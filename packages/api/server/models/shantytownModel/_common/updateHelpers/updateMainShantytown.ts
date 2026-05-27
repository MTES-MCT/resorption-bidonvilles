import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

/**
 * Met à jour les données principales du shantytown
 */
export default async function updateMainShantytown(
    shantytownId: number,
    updatedTown: Record<string, any>,
    transaction: Transaction,
): Promise<void> {
    if (Object.keys(updatedTown).length === 0) {
        return;
    }

    await sequelize.query(
        `UPDATE shantytowns
            SET
                ${Object.keys(updatedTown).map(column => `${column} = :${column}`).join(', ')}
            WHERE shantytown_id = :id`,
        {
            replacements: Object.assign(updatedTown, { id: shantytownId }),
            transaction,
        },
    );
}
