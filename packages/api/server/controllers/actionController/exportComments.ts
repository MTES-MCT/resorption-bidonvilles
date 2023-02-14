import actionService from '#server/services/action/actionService';

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    permission_denied: { code: 403, message: 'Permission refusée' },
    no_data: { code: 400, message: 'Aucune donnée à exporter' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    try {
        res.status(200).send({
            csv: await actionService.getCommentReport(req.user),
        });
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            error: {
                user_message: message,
            },
        });

        next(error.nativeError || error);
    }
};
