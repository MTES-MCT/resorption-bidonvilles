import ServiceError from '#server/errors/ServiceError';
import shantytownResorptionService from '#server/services/shantytownResorption';
import { ShantytownPreparatoryPhasesTowardResorption } from '#root/types/resources/ShantytownPreparatoryPhasesTowardResorption.d';

const ERROR_RESPONSES = {
    fetch_failed: { code: 500, message: 'Les étapes de lancement d\'une résorption n\'ont pas été trouvées...' },
    insert_failed: { code: 500, message: 'Le lancement de la résorption du site n\'a pas pu être enregistré.' },
    commit_failed: { code: 500, message: 'Le lancement de la résorption du site a échoué.' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue.' },
};
export default async (req, res, next) => {
    const currentUser = req.user;
    let resorptionStartingPhases: ShantytownPreparatoryPhasesTowardResorption[] = [];
    try {
        const town: { id: number } = req.params;
        const result = await shantytownResorptionService.start(town.id, currentUser);
        resorptionStartingPhases = result.phases;
    } catch (error: unknown) {
        const serviceError = error as ServiceError;
        const { code, message } = ERROR_RESPONSES[serviceError?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(serviceError.nativeError ?? serviceError);
    }
    return res.status(200).send({ resorptionStartingPhases });
};
