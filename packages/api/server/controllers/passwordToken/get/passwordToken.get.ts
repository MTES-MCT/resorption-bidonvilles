import jwt from 'jsonwebtoken';
import CONFIG from '#server/config';
import userModel from '#server/models/userModel';

export default async (req, res) => {
    if (!req.params.token) {
        return res.status(400).send({
            user_message: 'Le jeton d\'identification est manquant',
            code: 'Jeton manquant',
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(req.params.token, CONFIG.auth.secret);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erreur lors de la vérification du jeton:', error);
        return res.status(400).send({
            user_message: 'Le jeton d\'identification est invalide ou expiré.\nNous vous invitons à reprendre le formulaire de demande de renouvelement de mot de passe.',
            code: 'Jeton invalide ou expiré',
        });
    }

    if (decoded.type !== 'password_reset') {
        return res.status(400).send({
            user_message: 'Le jeton d\'identification est invalide',
            code: 'Jeton invalide',
        });
    }

    const user = await userModel.findOne(decoded.userId);
    if (user === null) {
        return res.status(400).send({
            user_message: 'Le jeton d\'identification ne correspond à aucun utilisateur',
            code: 'Utilisateur inexistant ou désactivé',
        });
    }

    return res.status(200).send({
        id: user.id,
        email: user.email,
    });
};
