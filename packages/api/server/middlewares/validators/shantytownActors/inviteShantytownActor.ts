import * as expressValidator from 'express-validator';
// models
import userModelFactory from '#server/models/userModel';

const { body } = expressValidator;
const userModel = userModelFactory();

export default [
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
