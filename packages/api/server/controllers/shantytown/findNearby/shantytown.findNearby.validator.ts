import { query } from 'express-validator';

export default [
    query('longitude')
        .notEmpty().bail().withMessage('Le paramètre longitude est obligatoire')
        .isFloat().bail().withMessage('Le paramètre longitude doit être un nombre décimal'),

    query('latitude')
        .notEmpty().bail().withMessage('Le paramètre latitude est obligatoire')
        .isFloat().bail().withMessage('Le paramètre latitude doit être un nombre décimal'),
];
