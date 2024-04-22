import userModel from '#server/models/userModel';
import authUtils from '#server/utils/auth';

const { hashPassword } = authUtils;

export default async (req, res, next) => {
    const { password } = req.body;
    const userId = req.params.id;

    if (typeof password !== 'string') {
        return res.status(400).send({
            user_message: 'Ces identifiants sont incorrects',
            fields: {
                password: ['Le mot de passe est invalide'],
            },
        });
    }

    const user = await userModel.findOne(userId, {
        auth: true,
    });

    try {
        const checkActualPassword = hashPassword(password, user.salt) === user.password;

        return res.status(200).send({
            checkActualPassword,
        });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la vérification du mot de passe.',
        });
        return next(error);
    }
};
