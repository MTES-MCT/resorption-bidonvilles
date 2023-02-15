import actionService from '#server/services/action/actionService';
import userService from '#server/services/userService';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    db_write_error: { code: 500, message: 'Une erreur est survenue lors de l\'écriture en base de données' },
};

export default async (req, res, next) => {
    try {
        const action = await actionService.update(
            req.params.id,
            req.user.id,
            req.body,
        );
        const permissions = await userService.getPermissions(req.user.id);

        return res.status(200).send({
            action,
            permissions,
        });
    } catch (error) {
        const { code, message } = ERRORS[error?.code] || ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next(error?.nativeError || error);
    }
};
