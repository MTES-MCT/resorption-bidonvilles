import shantytownService from '#server/services/shantytown';

const ERROR_RESPONSES = {
    closing_shantytown_not_allowed: { code: 403, message: 'Vous n\'êtes pas autorisé à fermer ce site' },
    update_failed: { code: 400, message: 'Une mise à jour en base de données a échoué' },
    anonymisation_failed: { code: 400, message: 'L\'anonymisation du nom du popriétaire a échoué' },
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    // close the town
    try {
        const updatedTown = await shantytownService.close(req.user, req.body);
        return res.status(200).send(updatedTown);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;

        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError || error);
    }
};
