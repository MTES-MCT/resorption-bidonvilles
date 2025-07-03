import shantytownService from '#server/services/shantytown';

const { fixClosedStatus } = shantytownService;

const ERROR_RESPONSES = {
    permission_denied: { code: 403, message: 'Permission refusée' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    try {
        const updatedTown = await fixClosedStatus(req.user, req.body);
        return res.status(200).send(updatedTown);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError ?? error);
    }
};
