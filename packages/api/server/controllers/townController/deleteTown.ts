import shantytownService from '#server/services/shantytown';

const { deleteTown } = shantytownService;

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    shantytown_unfound: { code: 400, message: 'Le site n\'existe pas en base de données' },
    delete_failed: { code: 500, message: 'Une suppression en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};


export default async (req, res, next) => {
    try {
        await deleteTown(req.user, req.params.id);
        return res.status(204).send({});
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            error: {
                user_message: message,
            },
        });
        return next(error.nativeError || error);
    }
};
