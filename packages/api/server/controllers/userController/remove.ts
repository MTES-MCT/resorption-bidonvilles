import userModel from '#server/models/userModel';

export default async (req, res, next) => {
    try {
        await userModel.deactivate([req.body.user.id]);
        return res.status(200).send(await userModel.findOne(req.body.user.id));
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la mise à jour du compte',
            },
        });
        return next(error);
    }
};
