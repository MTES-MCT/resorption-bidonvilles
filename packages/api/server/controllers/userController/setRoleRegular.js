const userModel = require('#server/models/userModel');

module.exports = async (req, res, next) => {
    try {
        await userModel.update(req.body.user.id, {
            fk_role_regular: req.body.role.id,
        });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la mise à jour du compte',
            },
        });
        return next(error);
    }

    return res.status(200).send({});
};
