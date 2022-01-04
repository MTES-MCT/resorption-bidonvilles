
const { sequelize } = require('#db/models');
const { triggerDeclaredActor } = require('#server/utils/mattermost');
const {
    sendUserShantytownActorNotification,
} = require('#server/mails/mails');
const { formatName } = require('#server/models/userModel')(sequelize);

module.exports = models => async (req, res, next) => {
    try {
        await triggerDeclaredActor(req.shantytown, req.user);
    } catch (error) {
        // ignore
    }

    // if the actor to be added is the current user, proceed
    if (req.body.user.id === req.user.id) {
        try {
            const actors = await sequelize.transaction(async (transaction) => {
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

            return res.status(201).send({
                actors: actors.map(models.shantytownActor.serializeActor),
            });
        } catch (error) {
            res.status(500).send({
                user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
            });
            return next(error);
        }
    }

    // otherwise, just send an email
    try {
        await sendUserShantytownActorNotification(req.body.user, {
            variables: {
                inviterName: formatName(req.user),
                shantytown: req.shantytown,
            },
        });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'invitation de l\'utilisateur',
        });
        return next(error);
    }

    return res.status(200).send({});
};
