import userModel from '#server/models/userModel';
import authUtils from '#server/utils/auth';

const { generateAccessTokenFor, hashPassword } = authUtils;

export default async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== 'string') {
        return res.status(400).send({
            user_message: 'Ces identifiants sont incorrects',
            fields: {
                email: ['L\'adresse e-mail est invalide'],
            },
        });
    }

    if (typeof password !== 'string') {
        return res.status(400).send({
            user_message: 'Ces identifiants sont incorrects',
            fields: {
                password: ['Le mot de passe est invalide'],
            },
        });
    }

    const user = await userModel.findOneByEmail(email, {
        auth: true,
    });

    if (user === null) {
        return res.status(403).send({
            user_message: 'Ces identifiants sont incorrects',
        });
    }

    if (user.status !== 'active') {
        return res.status(400).send({
            user_message: 'Votre compte doit être activé avant utilisation',
        });
    }

    const hashedPassword = hashPassword(password, user.salt);
    if (hashedPassword !== user.password) {
        return res.status(403).send({
            user_message: 'Ces identifiants sont incorrects',
        });
    }

    await userModel.resetInactivityAlertSentAt(user.id);

    return res.status(200).send({
        token: generateAccessTokenFor(user),
    });
};
