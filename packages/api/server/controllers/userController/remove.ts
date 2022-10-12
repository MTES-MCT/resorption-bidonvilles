const userModel = require('#server/models/userModel');

module.exports = async (req, res, next) => {
    let user;
    try {
        user = await userModel.findOne(req.params.id, undefined, req.user, 'deactivate');
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
            },
        });
        return next(error);
    }

    if (user === null) {
        return res.status(404).send({
            error: {
                user_message: 'L\'utilisateur auquel supprimer l\'accès n\'a pas été trouvé en base de données',
            },
        });
    }

    try {
        await userModel.deactivate(req.params.id);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la mise à jour du compte',
            },
        });
        next(error);
    }

    return res.status(200).send({});
};
