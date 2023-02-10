import actionService from '#server/services/action/actionService';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    db_write_error: { code: 500, message: 'Une erreur est survenue lors de l\'écriture en base de données' },
};

export default async (req, res, next) => {
    try {
        const action = await actionService.create(req.user.id, req.body);
        return res.status(201).send(action);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] || ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next(error?.nativeError || error);
    }
};
