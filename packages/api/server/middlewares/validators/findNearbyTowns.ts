/* eslint-disable newline-per-chained-call */
import * as expressValidator from 'express-validator';

const { query } = expressValidator;

export default [
    query('longitude')
        .isFloat()
        .notEmpty().withMessage('Le paramètre longitude est obligatoire'),

    query('latitude')
        .isFloat()
        .notEmpty().withMessage('Le paramètre latitude est obligatoire'),

];
