/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';

export default [
    body('page')
        .isString().bail().withMessage('Le nom de la page est invalide')
        .trim()
        .notEmpty().bail().withMessage('Le nom de la page est obligatoire'),
];
