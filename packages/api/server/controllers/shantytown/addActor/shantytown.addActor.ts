import { sequelize } from '#db/sequelize';

import shantytownActorModel from '#server/models/shantytownActorModel';
import mattermostUtils from '#server/utils/mattermost';
import mailsUtils from '#server/mails/mails';
import userModel from '#server/models/userModel';

const { triggerDeclaredActor, triggerInvitedActor } = mattermostUtils;
const { sendUserShantytownActorNotification } = mailsUtils;

export default async (req, res, next) => {
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
            // eslint-disable-next-line no-console
            console.error(error);
        }

        return res.status(201).send({
            actors: actors.map(shantytownActorModel.serializeActor),
        });
    }

    // otherwise, just send an email
    try {
        await sendUserShantytownActorNotification(req.body.user, {
            variables: {
                inviterName: userModel.formatName(req.user),
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
        // eslint-disable-next-line no-console
        console.error(error);
    }

    return res.status(200).send({});
};
