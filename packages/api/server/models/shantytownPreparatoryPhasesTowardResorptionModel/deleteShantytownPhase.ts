import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

type Phase = {
    fk_shantytown: number,
    fk_preparatory_phase: string,
};

export default async (phase: Phase, argTransaction: Transaction = undefined): Promise<void> => {
    let transaction: Transaction = argTransaction;
    if (transaction === undefined) {
        transaction = await sequelize.transaction();
    }

    try {
        const response = await sequelize.query(
            `DELETE FROM
                shantytown_preparatory_phases_toward_resorption
             WHERE
                fk_shantytown = :shantytownId
            AND
                fk_preparatory_phase = :preparatoryPhaseId`,
            {
                transaction,
                replacements: {
                    shantytownId: phase.fk_shantytown,
                    preparatoryPhaseId: phase.fk_preparatory_phase,
                },
            },
        );
        const rowCount: number = response[0] as unknown as number;

        if (rowCount === 0) {
            throw new Error(`La phase ${phase.fk_preparatory_phase} du site ${phase.fk_shantytown} est introuvable`);
        }

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
