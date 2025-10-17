import { sequelize } from '#db/sequelize';
import ServiceError from '#server/errors/ServiceError';
import preparatoryPhasesTowardResorptionModel from '#server/models/preparatoryPhasesTowardResorptionModel';
import shantytownPreparatoryPhasesTowardResorptionModel from '#server/models/shantytownPreparatoryPhasesTowardResorptionModel';
import shantytownModel from '#server/models/shantytownModel';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ShantytownPreparatoryPhasesTowardResorption } from '#root/types/resources/ShantytownPreparatoryPhasesTowardResorption.d';
import { PreparatoryPhaseTowardResorption } from '#root/types/resources/PreparatoryPhaseTowardResorption.d';

export default async (townId: number, user: AuthUser): Promise<{ townId: number, phases: ShantytownPreparatoryPhasesTowardResorption[] }> => {
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
                    created_by: user.id,
                    completed_at: new Date().toISOString(),
                },
                transaction,
            )));

            // Mettre à jour updated_at et updated_by dans la table shantytowns AVANT l'historisation
            await sequelize.query(
                `UPDATE shantytowns 
                 SET updated_at = NOW(), updated_by = :userId 
                 WHERE shantytown_id = :townId`,
                {
                    replacements: { userId: user.id, townId },
                    transaction,
                },
            );

            // Historiser l'état avec les phases
            await shantytownModel.update(
                user,
                townId,
                {},
                transaction,
            );
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
    // Préparation de l'objet à retourner
    const phases = await shantytownPreparatoryPhasesTowardResorptionModel.find(user, [townId.toString()]);
    return { townId, phases };
};
