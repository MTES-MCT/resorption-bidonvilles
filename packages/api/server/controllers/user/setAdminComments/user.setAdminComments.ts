import userModel from '#server/models/userModel';

export default async (req, res, next) => {
    if (!req.user.is_superuser) {
        return res.status(400).send({
            user_message: 'Vous n\'avez pas les permissions pour accéder à cette route',
        });
    }

    try {
        await userModel.update(req.params.id, {
            admin_comments: req.body.comment,
        });
        return res.status(200).send({
            admin_comments: req.body.comment,
        });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue dans l\'écriture de vos informations en base de données.',
        });
        return next(error);
    }
};
