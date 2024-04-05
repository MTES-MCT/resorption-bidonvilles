import jwt from 'jsonwebtoken';
import CONFIG from '#server/config';
import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel';
import userAccessModel from '#server/models/userAccessModel';
import organizationModel from '#server/models/organizationModel';
import accessRequestService from '#server/services/accessRequest/accessRequestService';
import checkPassword from '#server/utils/checkPassword';
import mattermostUtils from '#server/utils/mattermost';
import authUtils from '#server/utils/auth';

const { triggerNewUserAlert } = mattermostUtils;
const { hashPassword } = authUtils;

export default async (req, res, next) => {
    if (!req.body.token) {
        return res.status(400).send({
            user_message: 'Le jeton d\'activation est manquant',
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(req.body.token, CONFIG.auth.secret);
    } catch (error) {
        return res.status(400).send({
            user_message: 'Le jeton d\'activation est invalide ou expiré',
        });
    }

    let user;
    if (decoded.userId !== undefined) {
        user = await userModel.findOne(decoded.userId, { auth: true });
    } else {
        user = await userModel.findOneByAccessId(decoded.id, { auth: true });
    }

    if (user === null) {
        return res.status(400).send({
            user_message: 'Le jeton d\'activation ne correspond à aucun utilisateur',
        });
    }

    if (user.id !== parseInt(req.params.id, 10)) {
        return res.status(400).send({
            user_message: 'Le jeton d\'activation n\'est pas valide',
        });
    }

    if (user.status === 'active') {
        return res.status(400).send({
            user_message: 'Ce compte utilisateur est déjà activé',
        });
    }

    const errors = checkPassword(req.body.password, user.is_admin);

    if (errors.length > 0) {
        return res.status(400).send({
            user_message: 'Le mot de passe est invalide',
            fields: {
                password: errors,
            },
        });
    }

    try {
        await sequelize.transaction(async (transaction) => {
            const now = new Date();

            await organizationModel.activate(user.organization.id, transaction);
            await userModel.update(user.id, {
                password: hashPassword(req.body.password, user.salt),
                fk_status: 'active',
                password_conformity: (!!user.is_admin),
            }, transaction);
            await userAccessModel.update(decoded.id, {
                used_at: now,
            }, transaction);

            await accessRequestService.handleAccessActivated(user);
        });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
        });
        return next(error);
    }

    // Send a Matermost alert, if it fails, do nothing
    try {
        if (CONFIG.mattermost) {
            await triggerNewUserAlert(user);
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`Error with new user webhook : ${err.message}`);
    }

    return res.status(200).send({});
};
