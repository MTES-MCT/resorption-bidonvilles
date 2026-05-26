import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';

export default async function update(preparatoryPhase, argTransaction: Transaction = undefined): Promise<void> {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();
    try {
        await sequelize.query(
            `UPDATE 
                shantytown_preparatory_phases_toward_resorption
            SET
                completed_at = :completedAt
            WHERE
                fk_shantytown = :shantytownId
            AND
                fk_preparatory_phase = :preparatoryPhaseId`,
            {
                type: QueryTypes.UPDATE,
                transaction,
                replacements: {
                    shantytownId: preparatoryPhase.shantytownId,
                    preparatoryPhaseId: preparatoryPhase.preparatoryPhaseId,
                    completedAt: preparatoryPhase.completedAt,
                },
            },
        );
        if (argTransaction === undefined) {
            await transaction.commit();
        }
    } catch (error) {
        if (argTransaction === undefined) {
            await transaction.rollback();
        }
        throw error;
    }
}
