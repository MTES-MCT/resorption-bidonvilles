import { body } from 'express-validator';
import userModel from '#server/models/userModel';
import shantytownIdValidator from '#server/controllers/shantytown/_common/shantytown.id.validator';

export default [
    shantytownIdValidator,

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
                // eslint-disable-next-line no-console
                console.error(error);
                throw new Error('Une erreur est survenue lors de la vérification du courriel');
            }

            if (user !== null) {
                throw new Error('Un utilisateur existe déjà pour ce courriel');
            }

            return true;
        }),
];
