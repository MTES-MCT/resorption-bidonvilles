import actionService from '#server/services/action/actionService';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

const requestPilotForAction = async (req, res, next) => {
    try {
        const requestPilot = await actionService.requestPilot(req.params.id, req.user);
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
