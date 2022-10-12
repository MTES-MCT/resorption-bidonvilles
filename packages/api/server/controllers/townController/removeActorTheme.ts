const sequelize = require('#db/sequelize');

const shantytownActorModel = require('#server/models/shantytownActorModel');

module.exports = async (req, res, next) => {
    let actors;
    try {
        actors = await sequelize.transaction(async (transaction) => {
            await shantytownActorModel.removeTheme(
                req.shantytown.id,
                req.body.user.id,
                req.params.theme_id,
                req.user.id,
                transaction,
            );

            return shantytownActorModel.findAll(
                req.shantytown.id,
                transaction,
            );
        });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
        });
        return next(error);
    }

    const actor = actors
        .map(shantytownActorModel.serializeActor)
        .find(({ id }) => id === req.body.user.id);

    return res.status(200).send(actor);
};
