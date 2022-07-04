const userModel = require('#server/models/userModel');

module.exports = async (req, res, next) => {
    try {
        await userModel.update(req.params.id, {
            admin_comments: req.body.comment,
        });
        return res.status(200).send({
            admin_comments: req.body.comment,
        });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue dans l\'écriture de vos informations en base de données.',
            },
        });
        return next(error);
    }
};
