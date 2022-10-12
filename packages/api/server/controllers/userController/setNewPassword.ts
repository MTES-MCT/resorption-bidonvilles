const jwt = require('jsonwebtoken');
const CONFIG = require('#server/config');
const userModel = require('#server/models/userModel');
const { hashPassword } = require('#server/utils/auth');
const checkPassword = require('./helpers/checkPassword');

module.exports = async (req, res, next) => {
    if (!req.body.token) {
        return res.status(400).send({
            error: {
                user_message: 'Le jeton d\'identification est manquant',
            },
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(req.body.token, CONFIG.auth.secret);
    } catch (error) {
        return res.status(400).send({
            error: {
                user_message: 'Le jeton d\'identification est invalide ou expiré',
            },
        });
    }

    if (decoded.type !== 'password_reset') {
        return res.status(400).send({
            error: {
                user_message: 'Le jeton d\'identification n\'est pas valide',
            },
        });
    }

    const user = await userModel.findOne(decoded.userId, { auth: true });
    if (user === null) {
        return res.status(400).send({
            error: {
                user_message: 'Le jeton d\'identification ne correspond à aucun utilisateur',
            },
        });
    }

    if (user.id !== parseInt(req.params.id, 10)) {
        return res.status(400).send({
            error: {
                user_message: 'Le jeton d\'identification n\'est pas valide',
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
        await userModel.update(user.id, {
            password: hashPassword(req.body.password, user.salt),
        });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
            },
        });
        return next(error);
    }

    return res.status(200).send({});
};
