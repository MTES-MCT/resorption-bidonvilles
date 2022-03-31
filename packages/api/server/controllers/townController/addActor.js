const sequelize = require('#db/sequelize');

const shantytownActorModel = require('#server/models/shantytownActorModel');
const { triggerDeclaredActor, triggerInvitedActor } = require('#server/utils/mattermost');
const {
    sendUserShantytownActorNotification,
} = require('#server/mails/mails');
const { formatName } = require('#server/models/userModel')(sequelize);

module.exports = async (req, res, next) => {
    // if the actor to be added is the current user, proceed
    if (req.body.user.id === req.user.id) {
        let actors;
        try {
            actors = await sequelize.transaction(async (transaction) => {
                await shantytownActorModel.addActor(
                    req.shantytown.id,
                    req.body.user.id,
                    req.body.themes,
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

        try {
            await triggerDeclaredActor(req.shantytown, req.user);
        } catch (error) {
            // ignore
        }

        return res.status(201).send({
            actors: actors.map(shantytownActorModel.serializeActor),
        });
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

    try {
        await triggerInvitedActor(req.shantytown, req.user, req.body.user);
    } catch (error) {
        // ignore
    }

    return res.status(200).send({});
};
