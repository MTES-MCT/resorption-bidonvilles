import shantytownResorptionService from '#server/services/shantytownResorption';

const ERROR_RESPONSES = {
    fetch_failed: { code: 500, message: 'Les étapes de lancement d\'une résoprtion n\'ont pas été trouvées...' },
    insert_failed: { code: 500, message: 'Le lancement de la résorption du site n\'a pas pu être enregistré.' },
    commit_failed: { code: 500, message: 'Le lancement de la résorption du site a échoué.' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue.' },
};
export default async (req, res, next) => {
    let resorptionStartingPhases = [];
    try {
        const town = req.params;
        const result = await shantytownResorptionService.start(town.id);
        resorptionStartingPhases = result.phases;
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError || error);
    }
    return res.status(200).send({ resorptionStartingPhases });
};
