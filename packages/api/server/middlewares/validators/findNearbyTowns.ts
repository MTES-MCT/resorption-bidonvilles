/* eslint-disable newline-per-chained-call */
import { query } from 'express-validator';

export default [
    query('longitude')
        .isFloat()
        .notEmpty().withMessage('Le paramètre longitude est obligatoire'),

    query('latitude')
        .isFloat()
        .notEmpty().withMessage('Le paramètre latitude est obligatoire'),

];
