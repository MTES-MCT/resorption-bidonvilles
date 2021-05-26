
const { sequelize } = require('#db/models');
const mailService = require('#server/services/mailService');

module.exports = models => async (req, res, next) => {
    let actors;
    try {
        actors = await sequelize.transaction(async (transaction) => {
            await models.shantytownActor.addActor(
                req.shantytown.id,
                req.body.user.id,
                req.body.themes,
                req.user.id,
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

    // if the actor is not the current user, send a notification by mail
    if (req.body.user.id !== req.user.id) {
        try {
            await mailService.send(
                'shantytown_actors/notification',
                req.body.user,
                null,
                [
                    req.user,
                    req.shantytown,
                ],
                mailService.PRESERVE_RECIPIENT,
            );
        } catch (error) {
            console.log(error);
            // ignore
        }
    }

    return res.status(201).send({
        actors: actors.map(models.shantytownActor.serializeActor),
    });
};
