import userModel from '#server/models/userModel';

export default async (req, res, next) => {
    if (req.user.is_admin !== true) {
        return res.status(400).send({
            user_message: 'Vous n\'avez pas les permissions pour accéder à cette route',
        });
    }

    try {
        await userModel.update(req.body.user.id, {
            fk_role_regular: req.body.role.id,
        });
        return res.status(200).send(await userModel.findOne(req.body.user.id));
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la mise à jour du compte',
        });
        return next(error);
    }
};
