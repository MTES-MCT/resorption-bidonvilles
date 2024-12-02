import { sequelize } from '#db/sequelize';
import ServiceError from '#server/errors/ServiceError';
import preparatoryPhasesTowardResorptionModel from '#server/models/preparatoryPhasesTowardResorptionModel';
import shantytownPreparatoryPhasesTowardResorptionModel from '#server/models/shantytownPreparatoryPhasesTowardResorptionModel';
import { PreparatoryPhaseTowardResorption } from '#root/types/resources/PreparatoryPhaseTowardResorption.d';

export default async (townId: number, userId: number): Promise<{ townId: number, phases: PreparatoryPhaseTowardResorption[] }> => {
    const transaction = await sequelize.transaction();
    let resorptionStartingPhases: PreparatoryPhaseTowardResorption[] = [];

    // Récupérer les phases préparatoires définissant le démarrage de la résorption
    resorptionStartingPhases = await preparatoryPhasesTowardResorptionModel.getAll(true);
    if (resorptionStartingPhases.length === 0) {
        throw new ServiceError('fetch_failed', new Error('Impossible de trouver les phases définissant le démarrage de la résorption'));
    }

    // Créer les phases préparatoires pour la résorption
    if (resorptionStartingPhases.length > 0) {
        try {
            await Promise.all(resorptionStartingPhases.map(preparatoryPhase => shantytownPreparatoryPhasesTowardResorptionModel.create(
                {
                    fk_shantytown: townId,
                    fk_preparatory_phase: preparatoryPhase.uid,
                    created_by: userId,
                },
                transaction,
            )));
        } catch (error) {
            await transaction.rollback();
            throw new ServiceError('insert_failed', error);
        }
    }

    // Finaliser
    try {
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('commit_failed', error);
    }
    return { townId, phases: resorptionStartingPhases };
};
