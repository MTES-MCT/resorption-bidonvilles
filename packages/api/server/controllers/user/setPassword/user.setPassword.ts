import jwt from 'jsonwebtoken';
import CONFIG from '#server/config';
import userModel from '#server/models/userModel';
import authUtils from '#server/utils/auth';
import checkPassword from '#server/utils/checkPassword';

const { hashPassword } = authUtils;

export default async (req, res, next) => {
    if (!req.body.token) {
        return res.status(400).send({
            user_message: 'Le jeton d\'identification est manquant',
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(req.body.token, CONFIG.auth.secret);
    } catch (error) {
        return res.status(400).send({
            user_message: 'Le jeton d\'identification est invalide ou expiré',
        });
    }

    if (decoded.type !== 'password_reset') {
        return res.status(400).send({
            user_message: 'Le jeton d\'identification n\'est pas valide',
        });
    }

    const user = await userModel.findOne(decoded.userId, { auth: true });
    if (user === null) {
        return res.status(400).send({
            user_message: 'Le jeton d\'identification ne correspond à aucun utilisateur',
        });
    }

    if (user.id !== parseInt(req.params.id, 10)) {
        return res.status(400).send({
            user_message: 'Le jeton d\'identification n\'est pas valide',
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
        await userModel.update(user.id, {
            password: hashPassword(req.body.password, user.salt),
        });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
        });
        return next(error);
    }

    return res.status(200).send({});
};
