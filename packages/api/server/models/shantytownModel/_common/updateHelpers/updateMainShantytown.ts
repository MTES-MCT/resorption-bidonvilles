import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

const COLUMN_NAME_PATTERN = /^\w+$/;

/**
 * Met à jour les données principales du shantytown
 */
export default async function updateMainShantytown(
    shantytownId: number,
    updatedTown: Record<string, any>,
    transaction: Transaction,
): Promise<void> {
    const columns = Object.keys(updatedTown);
    if (columns.length === 0) {
        return;
    }

    if (columns.some(column => !COLUMN_NAME_PATTERN.test(column))) {
        throw new Error('Nom de colonne invalide pour la mise à jour du site');
    }

    await sequelize.query(
        `UPDATE shantytowns
            SET
                ${columns.map(column => `${column} = :${column}`).join(', ')}
            WHERE shantytown_id = :id`,
        {
            replacements: Object.assign(updatedTown, { id: shantytownId }),
            transaction,
        },
    );
}
