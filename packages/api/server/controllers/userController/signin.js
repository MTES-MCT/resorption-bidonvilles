const userModel = require('#server/models/userModel');
const { generateAccessTokenFor, hashPassword } = require('#server/utils/auth');

module.exports = async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== 'string') {
        return res.status(400).send({
            success: false,
            error: {
                user_message: 'Ces identifiants sont incorrects',
                fields: {
                    email: ['L\'adresse e-mail est invalide'],
                },
            },
        });
    }

    if (typeof password !== 'string') {
        return res.status(400).send({
            success: false,
            error: {
                user_message: 'Ces identifiants sont incorrects',
                fields: {
                    password: ['Le mot de passe est invalide'],
                },
            },
        });
    }

    const user = await userModel.findOneByEmail(email, {
        auth: true,
    });

    if (user === null) {
        return res.status(403).send({
            success: false,
            error: {
                user_message: 'Ces identifiants sont incorrects',
            },
        });
    }

    if (user.status !== 'active') {
        return res.status(400).send({
            success: false,
            error: {
                user_message: 'Votre compte doit être activé avant utilisation',
            },
        });
    }

    const hashedPassword = hashPassword(password, user.salt);
    if (hashedPassword !== user.password) {
        return res.status(403).send({
            success: false,
            error: {
                user_message: 'Ces identifiants sont incorrects',
            },
        });
    }

    return res.status(200).send({
        success: true,
        token: generateAccessTokenFor(user),
    });
};
