import shantytownService from '#server/services/shantytown';

const { exportTown } = shantytownService;

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    permission_denied: { code: 403, message: 'Accès refusé' },
    write_failed: { code: 500, message: 'Une écriture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    let buffer;
    try {
        buffer = await exportTown(req.user, req.query);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            error: {
                user_message: message,
            },
        });
        return next(error.nativeError || error);
    }

    return res.end(buffer);
};