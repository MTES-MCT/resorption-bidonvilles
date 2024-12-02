import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type ShantytownPreparatoryPhaseTowardResorptionParam = {
    fk_shantytown: number;
    fk_preparatory_phase: string;
    created_by: number;
};

export default async (data: ShantytownPreparatoryPhaseTowardResorptionParam, transaction = undefined): Promise<number> => {
    const result = await sequelize.query(
        `INSERT INTO shantytown_preparatory_phases_toward_resorption (fk_shantytown, fk_preparatory_phase, created_by)
            VALUES (:shantytownId, :preparatoryPhaseId, :createdBy) RETURNING fk_shantytown`,
        {
            type: QueryTypes.INSERT,
            replacements: {
                shantytownId: data.fk_shantytown,
                preparatoryPhaseId: data.fk_preparatory_phase,
                createdBy: data.created_by,
            },
            transaction,
        },
    );
    return result[0][0].fk_shantytown;
};
