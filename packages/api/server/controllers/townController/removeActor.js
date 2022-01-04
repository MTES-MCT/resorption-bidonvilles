
const { sequelize } = require('#db/models');
const { triggerRemoveDeclaredActor } = require('#server/utils/mattermost');

module.exports = models => async (req, res, next) => {
    try {
        await triggerRemoveDeclaredActor(req.shantytown, req.user);
    } catch (error) {
        // ignore
    }

    let actors;
    try {
        actors = await sequelize.transaction(async (transaction) => {
            await models.shantytownActor.removeActor(
                req.shantytown.id,
                req.body.user.id,
                transaction,
            );

            return models.shantytownActor.findAll(
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

    return res.status(200).send({
        actors: actors.map(models.shantytownActor.serializeActor),
    });
};
