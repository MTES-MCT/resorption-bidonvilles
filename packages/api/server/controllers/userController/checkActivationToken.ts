import jwt from 'jsonwebtoken';
import CONFIG from '#server/config';
import userModelFactory from '#server/models/userModel';

const userModel = userModelFactory();

export default async (req, res) => {
    if (!req.params.token) {
        return res.status(400).send({
            error: {
                user_message: 'Le jeton d\'activation est manquant',
            },
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(req.params.token, CONFIG.auth.secret);
    } catch (error) {
        return res.status(400).send({
            error: {
                user_message: 'Le jeton d\'activation est invalide ou expiré.\nNous vous invitons à contacter l\'administrateur local qui vous a envoyé le mail avec ce lien d\'activation.',
            },
        });
    }

    let user;
    if (decoded.userId !== undefined) {
        user = await userModel.findOne(decoded.userId);
    } else {
        user = await userModel.findOneByAccessId(decoded.id);
    }

    if (user === null) {
        return res.status(400).send({
            error: {
                user_message: 'Le jeton d\'activation ne correspond à aucun utilisateur',
            },
        });
    }

    if (user.status !== 'new') {
        return res.status(400).send({
            error: {
                user_message: 'Ce compte utilisateur est déjà activé',
            },
        });
    }

    return res.status(200).send({
        id: user.id,
        email: user.email,
    });
};
