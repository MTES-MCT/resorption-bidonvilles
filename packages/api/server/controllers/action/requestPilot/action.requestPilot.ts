import actionService from '#server/services/action/actionService';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

const requestPilotForAction = async (req, res, next) => {
    try {
        const action = await actionService.fetch(req.user, [req.params.id]);

        if (!action) {
            return res.status(404).send({});
        }

        const requestPilot = await actionService.requestPilot(action[0], req.user);

        return res.status(200).send(requestPilot ?? false);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next(error?.nativeError ?? error);
    }
};

export default requestPilotForAction;
