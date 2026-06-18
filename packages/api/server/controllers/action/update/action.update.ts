import actionService from '#server/services/action/actionService';
import userService from '#server/services/user/index';
import can from '#server/utils/permission/can';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    action_insert_error: { code: 500, message: 'Une erreur est survenue lors de l\'écriture en base de données' },
    action_fetch_error: { code: 500, message: 'Une erreur est survenue lors de la vérifiation d\'écriture en base de données' },
    action_not_found: { code: 404, message: 'L\'insertion de l\'action en base de données n\'a pas pu aboutir' },
    no_principal_operator: { code: 400, message: 'Vous devez désigner un opérateur principal' },
    multiple_principal_operators: { code: 400, message: 'Un seul opérateur peut être désigné comme principal' },
    forbidden_principal_change: { code: 403, message: 'Seuls les pilotes de l\'action et les administrateurs nationaux peuvent désigner l\'opérateur principal' },
};

export default async (req, res, next) => {
    if (!can(req.user).do('update', 'action').on(req.action)) {
        return res.status(403).send({
            user_message: 'Vous n\'avez pas les droits suffisants pour modifier cette action',
        });
    }

    try {
        const action = await actionService.update(
            req.action,
            req.user,
            req.body,
        );
        const permissions = await userService.getPermissions(req.user.id);

        return res.status(200).send({
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
