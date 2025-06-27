import userService from '#server/services/user/index';

const ERROR_RESPONSES = {
    insert_failed: 'Les options n\'ont pas pu être enregistrées',
    undefined: 'Une erreur inconnue est survenue.',
};

export default async (req, res, next) => {
    let updatedUser;

    try {
        updatedUser = await userService.updatePermissionOptions(
            req.body.user.id,
            req.body.options,
        );
    } catch (error) {
        res.status(500).send({
            user_message: ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined,
        });
        return next(error?.nativeError ?? error);
    }

    return res.status(201).send({
        user: updatedUser,
    });
};
