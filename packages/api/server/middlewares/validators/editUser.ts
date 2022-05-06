/* eslint-disable newline-per-chained-call */
import * as expressValidator from 'express-validator';
import checkPassword from '#server/controllers/userController/helpers/checkPassword';

const { body } = expressValidator;

export default [
    body('last_name')
        .isString()
        .trim()
        .notEmpty().withMessage('Le nom de famille est obligatoire'),

    body('first_name')
        .isString()
        .trim()
        .notEmpty().withMessage('Le prénom est obligatoire'),

    body('password')
        .isString()
        .trim()
        .custom((value) => {
            if (!value) {
                return true;
            }

            const errors = checkPassword(value);

            if (errors.length) {
                throw new Error(errors[0]);
            }

            return true;
        }),

    body('phone')
        .optional()
        .isString()
        .trim()
        .custom((value) => {
            if (!value) {
                return true;
            }

            const frenchPhoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/gmi;
            const match = value.match(frenchPhoneRegex);

            if (!match) {
                throw new Error('Le téléphone est invalide');
            }

            return true;
        }),

    body('subscribed_to_summary')
        .notEmpty().bail().withMessage('Le champ "Abonnement au récapitulatif hebdomadaire" est obligatoire')
        .isBoolean().bail().withMessage('Le champ "Abonnement au récapitulatif hebdomadaire" est invalide'),
];
