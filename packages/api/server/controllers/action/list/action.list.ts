import actionService from '#server/services/action/actionService';

const ERRORS = {
    fetch_failed: { code: 500, message: 'Impossible de récupérer les actions' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    try {
        const { organizationId } = req.query;
        const actions = await actionService.fetch(req.user, undefined, organizationId);
        return res.status(200).send(actions);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next(error?.nativeError ?? error);
    }
};
