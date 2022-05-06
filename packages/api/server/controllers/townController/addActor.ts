import { sequelize } from '#db/sequelize';
import mattermost from '#server/utils/mattermost';
import mails from '#server/mails/mails';
import userModelFactory from '#server/models/userModel';

const { triggerDeclaredActor, triggerInvitedActor } = mattermost;
const {
    sendUserShantytownActorNotification,
} = mails;
const { formatName } = userModelFactory();

export default models => async (req, res, next) => {
    // if the actor to be added is the current user, proceed
    if (req.body.user.id === req.user.id) {
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

        try {
            await triggerDeclaredActor(req.shantytown, req.user);
        } catch (error) {
            // ignore
        }

        return res.status(201).send({
            actors: actors.map(models.shantytownActor.serializeActor),
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
