import actionService from '#server/services/action/actionService';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    try {
        const action = await actionService.update(
            req.params.id,
            req.body,
        );
        return res.status(200).send(action);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] || ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next(error?.nativeError || error);
    }
};
