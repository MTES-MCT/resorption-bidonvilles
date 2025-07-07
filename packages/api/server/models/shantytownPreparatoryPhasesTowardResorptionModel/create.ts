import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';

type ShantytownPreparatoryPhaseTowardResorptionParam = {
    fk_shantytown: number;
    fk_preparatory_phase: string;
    created_by: number;
    completed_at?: number | string | null;
};

export default async (data: ShantytownPreparatoryPhaseTowardResorptionParam, argTransaction: Transaction = undefined): Promise<number> => {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();

    try {
        const query = `
        INSERT INTO shantytown_preparatory_phases_toward_resorption 
        (fk_shantytown, fk_preparatory_phase, created_by ${data.completed_at ? ', completed_at' : ''})
        VALUES (:shantytownId, :preparatoryPhaseId, :createdBy ${data.completed_at ? ', :completedAt' : ''})
        RETURNING fk_shantytown
        `;

        const replacements = {
            shantytownId: data.fk_shantytown,
            preparatoryPhaseId: data.fk_preparatory_phase,
            createdBy: data.created_by,
            completedAt: data.completed_at ? data.completed_at : null,
        };

        const result = await sequelize.query(query, {
            type: QueryTypes.INSERT,
            replacements,
            transaction,
        });

        if (argTransaction === undefined) {
            await transaction.commit();
        }
        return result[0][0].fk_shantytown;
    } catch (error) {
        if (argTransaction === undefined) {
            await transaction.rollback();
        }
        throw error;
    }
};
