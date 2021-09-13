/* eslint-disable newline-per-chained-call */
const { body } = require('express-validator');
const newUser = require('./common/newUser');

const ALLOWED_TYPES = require('#server/config/contact_request_types');

module.exports = newUser(
    [
        body('verifEmail')
            .custom((value, { req }) => {
                if (value !== req.body.email) {
                    throw new Error('Les deux adresses email ne se correspondent pas');
                }
                return true;
            }),
        body('request_type')
            .isArray({ min: 1 }).withMessage('Vous devez préciser la ou les raisons de votre prise de contact')
            .custom((requestTypes) => {
                if (!Array.isArray(requestTypes)) {
                    return true;
                }

                const improperValues = requestTypes.filter(type => !ALLOWED_TYPES.includes(type));
                if (improperValues.length > 0) {
                    throw new Error('Certaines raisons sélectionnées ne sont pas reconnues');
                }

                return true;
            }),

        body('is_actor')
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

        body('referral')
            .customSanitizer(value => value || null),

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
