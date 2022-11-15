import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel';
import userAccessModel from '#server/models/userAccessModel';
import accessRequestService from '#server/services/accessRequest/accessRequestService';
import permissionsDescription from '#server/permissions_description';
import authUtils from '#server/utils/auth';

const { getExpiracyDateForActivationTokenCreatedAt } = authUtils;

export default async (req, res, next) => {
    let user;
    try {
        user = await userModel.findOne(req.params.id, { extended: true }, req.user, 'activate');
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
                user_message: 'L\'utilisateur auquel envoyer un accès n\'a pas été trouvé en base de données',
            },
        });
    }

    if (user.status !== 'new') {
        return res.status(400).send({
            error: {
                user_message: 'L\'utilisateur concerné n\'a pas de demande d\'accès en attente',
            },
        });
    }

    try {
        await sequelize.transaction(async (transaction) => {
            const { options } = permissionsDescription[user.role_id];
            const requestedOptions = options
                .filter(({ id }) => req.body.options && req.body.options[id] === true)
                .map(({ id }) => id);
            await userModel.setPermissionOptions(user.id, requestedOptions, transaction);

            // reload the user to take options into account (they might have changed above)
            user = await userModel.findOne(
                req.params.id,
                { extended: true },
                req.user,
                'activate',
                transaction,
            );

            const now = new Date();
            const expiresAt = getExpiracyDateForActivationTokenCreatedAt(now);
            const userAccessId = await userAccessModel.create({
                fk_user: user.id,
                sent_by: req.user.id,
                created_at: now,
                expires_at: expiresAt,
            }, transaction);

            await accessRequestService.resetRequestsForUser(user);
            await accessRequestService.handleAccessRequestApproved(
                user,
                {
                    id: userAccessId,
                    expires_at: expiresAt.getTime() / 1000,
                    sent_by: req.user,
                },
            );
        });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de l\'envoi du lien d\'activation',
            },
        });
        return next(error);
    }

    return res.status(200).send({});
};
