/* eslint-disable newline-per-chained-call */
const { query } = require('express-validator');

module.exports = [
    query('options')
        .optional({ nullable: true })
        .isString().bail().withMessage('Les options sont au mauvais format')
        .trim()
        .customSanitizer(value => (value ? value.split(',') : []))
        .custom((value) => {
            if (value.some(option => !['actors', 'actions', 'justice', 'comments', 'history'].includes(option))) {
                throw new Error('Certaines options ne sont pas reconnues');
            }

            return true;
        }),

    query('options')
        .customSanitizer(value => (Array.isArray(value) ? value : [])),
];
