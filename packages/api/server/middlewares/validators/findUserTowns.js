/* eslint-disable newline-per-chained-call */
const { query } = require('express-validator');

module.exports = [
    query('t')
        .isString()
        .trim()
        .custom((value) => {
            if (value && !['actors', 'navigation_logs'].includes(value)) {
                throw new Error('Une erreur est survenue lors de la vérification des données');
            }
            return true;
        }),
];
