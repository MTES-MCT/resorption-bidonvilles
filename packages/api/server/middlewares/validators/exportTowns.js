const { query } = require('express-validator');

module.exports = [
    query('date')
        .toInt()
        .isInt()
        .bail()
        .withMessage('La date doit être un timestamp'),

    query('date')
        .customSanitizer(value => value || Date.now())
        .custom((value) => {
            const today = new Date();
            const then = new Date(value);
            today.setHours(0, 0, 0, 0);
            then.setHours(0, 0, 0, 0);

            if (then > today) {
                throw new Error('Vous ne pouvez pas générer un export pour une date future');
            }

            return true;
        }),
];
