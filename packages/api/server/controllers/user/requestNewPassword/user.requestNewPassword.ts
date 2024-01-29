import userModel from '#server/models/userModel';
import dateUtils from '#server/utils/date';
import authUtils from '#server/utils/auth';
import mailsUtils from '#server/mails/mails';

const { toString: dateToString } = dateUtils;
const { getPasswordResetLink } = authUtils;
const { sendUserNewPassword } = mailsUtils;

export default async (req, res, next) => {
    let user;
    try {
        user = await userModel.findOneByEmail(req.body.email);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
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
                user_message: 'Une erreur est survenue lors de l\'envoi du mail',
            });
            return next(error);
        }
    }

    return res.status(200).send({});
};
