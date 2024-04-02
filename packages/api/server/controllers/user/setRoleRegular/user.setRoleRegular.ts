import setRoleRegularService from '#server/services/user/setRoleRegular';

const ERROR_RESPONSES = {
    permission_denied: { code: 403, message: 'Vous n\'avez pas les droits suffisants pour modifier le rôle d\'un utilisateur' },
    update_role_regular_failure: { code: 500, message: 'Une erreur est survenue lors de la mise à jour du rôle de l\'utilisateur' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    try {
        const updatedUser = await setRoleRegularService(req.user, req.body.user.id, req.body.role.id);
        return res.status(200).send(updatedUser);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next(error.nativeError || error);
    }
};
