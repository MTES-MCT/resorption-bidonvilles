/* eslint-disable newline-per-chained-call */
const { body } = require('express-validator');
const newUser = require('./common/newUser');

const ALLOWED_TYPES = require('#server/config/contact_request_types');

module.exports = newUser(
    [
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
    ],

    (value, { req }) => req.body.is_actor === true && req.body.request_type.includes('access-request'),
);
