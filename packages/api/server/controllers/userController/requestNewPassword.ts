const userModel = require('#server/models/userModel');
const { toString: dateToString } = require('#server/utils/date');
const { getPasswordResetLink } = require('#server/utils/auth');
const { sendUserNewPassword } = require('#server/mails/mails');
const sanitize = require('./helpers/sanitize');
const validate = require('./helpers/validate');

module.exports = async (req, res, next) => {
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
