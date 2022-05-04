const { query } = require('express-validator');

module.exports = [
    query('date')
        .toInt()
        .isInt()
        .bail()
        .withMessage('La date doit être un timestamp'),

    query('date')
        .customSanitizer(value => value || Date.now()),
];
