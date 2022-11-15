/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';
import checkPassword from '#server/controllers/userController/helpers/checkPassword';
import EMAIL_SUBSCRIPTIONS from '#server/config/email_subscriptions';

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

    body('email_subscriptions')
        .exists().withMessage('Le champ "Abonnement aux mails plateforme" est obligatoire')
        .isArray().bail().withMessage('Le champ "Abonnement aux mails plateforme" n\'est pas valide')
        .custom((value, { req }) => {
            if (value.some(subscription => !EMAIL_SUBSCRIPTIONS.includes(subscription))) {
                throw new Error('Le champ "Abonnement aux mails plateforme" contient des valeurs invalides');
            }

            req.body.email_unsubscriptions = EMAIL_SUBSCRIPTIONS.filter(subscription => !value.includes(subscription));
            return true;
        }),
];
