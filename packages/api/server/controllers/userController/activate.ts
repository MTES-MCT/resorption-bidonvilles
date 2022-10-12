const jwt = require('jsonwebtoken');
const CONFIG = require('#server/config');
const sequelize = require('#db/sequelize');
const userModel = require('#server/models/userModel');
const userAccessModel = require('#server/models/userAccessModel');
const organizationModel = require('#server/models/organizationModel');
const accessRequestService = require('#server/services/accessRequest/accessRequestService');
const checkPassword = require('#server/controllers/userController/helpers/checkPassword');
const { triggerNewUserAlert } = require('#server/utils/mattermost');
const { hashPassword } = require('#server/utils/auth');

module.exports = async (req, res, next) => {
    if (!req.body.token) {
        return res.status(400).send({
            error: {
                user_message: 'Le jeton d\'activation est manquant',
            },
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(req.body.token, CONFIG.auth.secret);
    } catch (error) {
        return res.status(400).send({
            error: {
                user_message: 'Le jeton d\'activation est invalide ou expiré',
            },
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
            error: {
                user_message: 'Le jeton d\'activation ne correspond à aucun utilisateur',
            },
        });
    }

    if (user.id !== parseInt(req.params.id, 10)) {
        return res.status(400).send({
            error: {
                user_message: 'Le jeton d\'activation n\'est pas valide',
            },
        });
    }

    if (user.status === 'active') {
        return res.status(400).send({
            error: {
                user_message: 'Ce compte utilisateur est déjà activé',
            },
        });
    }

    const errors = checkPassword(req.body.password);
    if (errors.length > 0) {
        return res.status(400).send({
            error: {
                user_message: 'Le mot de passe est invalide',
                fields: {
                    password: errors,
                },
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
            }, transaction);
            await userAccessModel.update(decoded.id, {
                used_at: now,
            }, transaction);

            await accessRequestService.handleAccessActivated(user);
        });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
            },
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
