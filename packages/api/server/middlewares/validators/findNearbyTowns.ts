/* eslint-disable newline-per-chained-call */
const { query } = require('express-validator');

module.exports = [
    query('longitude')
        .isFloat()
        .notEmpty().withMessage('Le paramètre longitude est obligatoire'),

    query('latitude')
        .isFloat()
        .notEmpty().withMessage('Le paramètre latitude est obligatoire'),

];
