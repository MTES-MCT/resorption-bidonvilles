import actionService from '#server/services/action/actionService';
import userService from '#server/services/user/index';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    insert_action_error: { code: 500, message: 'Une erreur est survenue lors de l\'écriture en base de données' },
    action_fetch_error: { code: 500, message: 'Une erreur est survenue lors de la vérification d\'écriture en base de données' },
    no_principal_operator: { code: 400, message: 'Vous devez désigner un opérateur principal' },
    multiple_principal_operators: { code: 400, message: 'Un seul opérateur peut être désigné comme principal' },
};

export default async (req, res, next) => {
    try {
        const action = await actionService.create(req.user, req.body);
        const permissions = await userService.getPermissions(req.user.id);

        return res.status(201).send({
            action,
            permissions,
        });
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error?.nativeError ?? error);
    }
};
