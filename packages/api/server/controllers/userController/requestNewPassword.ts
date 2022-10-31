import userModelFactory from '#server/models/userModel';
import dateUtils from '#server/utils/date';
import authUtils from '#server/utils/auth';
import mailsUtils from '#server/mails/mails';
import sanitize from './helpers/sanitize';
import validate from './helpers/validate';

const userModel = userModelFactory();
const { toString: dateToString } = dateUtils;
const { getPasswordResetLink } = authUtils;
const { sendUserNewPassword } = mailsUtils;

export default async (req, res, next) => {
    const data = { email: req.body.email };
    const fields = [
        { key: 'email', sanitizer: 'string', validatorOptions: [false] },
    ];
    const sanitizedData = sanitize(data, fields);

    const errors = await validate(sanitizedData, fields);
    if (Object.keys(errors).length > 0) {
        return res.status(400).send({
            error: {
                user_message: 'Certaines données sont manquantes ou invalides',
                fields: errors,
            },
        });
    }

    let user;
    try {
        user = await userModel.findOneByEmail(sanitizedData.email);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
            },
        });
        return next(error);
    }

    if (user !== null) {
        try {
            const resetLink = getPasswordResetLink(user);
            await sendUserNewPassword(user, {
                variables: {
                    link: {
                        link: resetLink.link,
                        expiracyDate: dateToString(resetLink.expiracyDate, true),

                    },
                },
            });
        } catch (error) {
            res.status(500).send({
                error: {
                    user_message: 'Une erreur est survenue lors de l\'envoi du mail',
                },
            });
            return next(error);
        }
    }

    return res.status(200).send({});
};
