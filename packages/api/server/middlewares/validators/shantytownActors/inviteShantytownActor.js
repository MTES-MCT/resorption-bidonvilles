const { body } = require('express-validator');

// models
const { sequelize } = require('#db/models');
const userModel = require('#server/models/userModel')(sequelize);

module.exports = [
    body('email')
        .trim()
        .notEmpty().withMessage('Vous devez préciser le courriel')
        .isEmail()
        .withMessage('Ce courriel n\'est pas valide')
        .normalizeEmail({
            gmail_remove_dots: false,
            gmail_remove_subaddress: false,
            gmail_convert_googlemaildotcom: false,
            outlookdotcom_remove_subaddress: false,
            yahoo_remove_subaddress: false,
            icloud_remove_subaddress: false,
        })
        .custom(async (value) => {
            let user = null;
            try {
                user = await userModel.findOneByEmail(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la vérification du courriel');
            }

            if (user !== null) {
                throw new Error('Un utilisateur existe déjà pour ce courriel');
            }

            return true;
        }),
];
