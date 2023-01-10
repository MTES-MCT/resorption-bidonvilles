import userService from '#server/services/user';

export default async (req, res, next) => {
    let user;

    try {
        user = await userService.updatePermissionOptions(
            req.params.id,
            req.body.options,
        );
    } catch (error) {
        let message;
        switch (error && error.code) {
            case 'insert_failed':
                message = 'Les options n\'ont pas pu être enregistrées';
                break;

            case 'fetch_failed':
                message = 'Impossible de trouver l\'utilisateur en base de données';
                break;

            default:
                message = 'Une erreur inconnue est survenue.';
        }

        res.status(500).send({
            user_message: message,
        });
        return next((error && error.nativeError) || error);
    }

    return res.status(201).send({
        user,
    });
};
