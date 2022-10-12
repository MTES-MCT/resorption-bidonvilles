const userModel = require('#server/models/userModel');
const { hashPassword } = require('#server/utils/auth');
const sanitize = require('./helpers/sanitize');
const validate = require('./helpers/validate');

module.exports = async (req, res, next) => {
    // ensure the user exists and actually needs an upgrade
    let user;
    try {
        user = await userModel.findOne(req.params.id, { auth: true });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est surenue lors de la lecture de la base de données',
            },
        });
        return next(error);
    }

    if (user === null) {
        return res.status(404).send({
            error: {
                user_message: 'Votre compte n\'a pas été retrouvé en base de données',
            },
        });
    }

    if (user.position !== '') {
        return res.status(400).send({
            error: {
                user_message: 'Votre compte est déjà à jour',
            },
        });
    }

    // validate the input data
    const rawData = {
        position: req.body.position,
        phone: req.body.phone,
        password: req.body.password,
    };

    const fields = [
        { key: 'position', sanitizer: 'string' },
        { key: 'phone', sanitizer: 'string' },
        { key: 'password', sanitizer: 'string' },
    ];

    const sanitizedData = sanitize(rawData, fields);
    const errors = await validate(sanitizedData, fields);

    if (Object.keys(errors).length > 0) {
        return res.status(400).send({
            error: {
                user_message: 'Certaines informations saisies sont incorrectes',
                fields: errors,
            },
        });
    }

    try {
        await userModel.update(user.id, Object.assign({}, sanitizedData, {
            password: hashPassword(sanitizedData.password, user.salt),
        }));
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
            },
        });
        next(error);
    }

    return res.status(200).send({});
};
