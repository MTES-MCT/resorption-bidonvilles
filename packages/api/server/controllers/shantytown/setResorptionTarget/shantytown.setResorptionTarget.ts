import shantytownService from '#server/services/shantytown';

const ERROR_RESPONSES = {
    permission_denied: { code: 403, message: 'Vous n\'avez pas la permission de marquer ce site comme "Objectif résorption"' },
    write_failed: { code: 500, message: 'Une erreur est survenue lors de l\'enregistrement en base de données' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    try {
        const updatedTown = await shantytownService.setResorptionTarget(req.user, req.body);
        return res.status(200).send(updatedTown);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError ?? error);
    }
};
