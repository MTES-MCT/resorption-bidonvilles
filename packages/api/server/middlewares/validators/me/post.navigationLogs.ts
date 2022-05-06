/* eslint-disable newline-per-chained-call */
import * as expressValidator from 'express-validator';

const { body } = expressValidator;

export default [
    body('page')
        .isString().bail().withMessage('Le nom de la page est invalide')
        .trim()
        .notEmpty().bail().withMessage('Le nom de la page est obligatoire'),
];
