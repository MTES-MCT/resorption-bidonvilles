/* eslint-disable newline-per-chained-call */
import * as expressValidator from 'express-validator';
import ALLOWED_TYPES from '#server/config/contact_request_types';
import newUser from '#server/controllers/user/_common/user.write.validator';

const { body } = expressValidator;

export default newUser(
    [
        body('verif_email')
            .custom((value, { req }) => {
                if (value !== req.body.email) {
                    throw new Error('Les deux adresses email ne se correspondent pas');
                }
                return true;
            }),
        body('request_type')
            .isString().withMessage('Vous devez préciser la raison de votre prise de contact')
            .custom((requestType) => {
                if (!ALLOWED_TYPES.includes(requestType)) {
                    throw new Error('La raison sélectionnée n’est pas reconnue');
                }
                return true;
            }),

        body('is_actor')
            .customSanitizer(value => (value === undefined ? false : value))
            .isBoolean().withMessage('Vous devez préciser si vous êtes un acteur de la résorption des bidonvilles'),

        body('access_request_message')
            .trim()
            .notEmpty().withMessage('Vous devez préciser votre message'),

        body('referral')
            .notEmpty().bail().withMessage('Vous devez précisez par quel moyen vous avez connu la plateforme')
            .isString().bail().withMessage('Le champ "Comment avez-vous connu la plateforme Résorption-bidonvilles ?" est invalide')
            .trim()
            .custom((value) => {
                if (value && !['dihal_event', 'newsletter', 'social_network', 'word_of_mouth', 'online_search', 'other'].includes(value)) {
                    throw new Error('Une erreur est survenue lors de la vérification des données');
                }

                return true;
            }),

        body('referral_other')
            .customSanitizer((value, { req }) => {
                if (req.body.referral !== 'other') {
                    return null;
                }

                return value;
            })
            .optional({ nullable: true })
            .isString().bail().withMessage('Le champ "Autre ?" est invalide')
            .trim(),

        body('referral_word_of_mouth')
            .customSanitizer((value, { req }) => {
                if (req.body.referral !== 'word_of_mouth') {
                    return null;
                }

                return value;
            })
            .optional({ nullable: true })
            .isString().bail().withMessage('Le champ "Qui vous a recommandé la plateforme ?" est invalide')
            .trim(),

        body('phone')
            .isString().bail().withMessage('Le numéro de téléphone n\'est pas reconnu')
            .trim()
            .notEmpty().bail().withMessage('Vous devez préciser votre téléphone'),
    ],

    (value, { req }) => req.body.is_actor === true && req.body.request_type.includes('access-request'),
);
