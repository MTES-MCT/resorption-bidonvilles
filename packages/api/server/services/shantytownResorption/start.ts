import { sequelize } from '#db/sequelize';
import ServiceError from '#server/errors/ServiceError';
import ShantytownResorptionModel from '#server/models/preparatoryPhasesTowardResorptionModel';
import { QueryTypes } from 'sequelize';
import { PreparatoryPhaseTowardResorption } from '#root/types/resources/PreparatoryPhaseTowardResorption.d';


export default async (townId: number): Promise<{ townId: number, phases: PreparatoryPhaseTowardResorption[] }> => {
    const transaction = await sequelize.transaction();
    let resorptionStartingPhases: PreparatoryPhaseTowardResorption[] = [];

    // Récupérer les phases préparatoires définissant le démarrage de la résorption
    resorptionStartingPhases = await ShantytownResorptionModel.getStartingPhases();
    if (resorptionStartingPhases.length === 0) {
        throw new ServiceError('fetch_failed', new Error('Impossible de trouver les phases définissant le démarrage de la résorption'));
    }

    // Créer les phases préparatoires pour la résorption
    if (resorptionStartingPhases.length > 0) {
        try {
            await Promise.all(resorptionStartingPhases.map(preparatoryPhase => sequelize.query(
                `INSERT INTO shantytown_preparatory_phases_toward_resorption (fk_shantytown, fk_preparatory_phase, created_by)
                    VALUES (:shantytownId, :preparatoryPhaseId, :createdBy)`,
                {
                    type: QueryTypes.INSERT,
                    replacements: {
                        shantytownId: townId,
                        preparatoryPhaseId: preparatoryPhase.uid,
                        createdBy: 1, // TODO: récupérer l'utilisateur connecté
                    },
                    transaction,
                },
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
