/* eslint-disable newline-per-chained-call */
import { query } from 'express-validator';

export default [
    query('query')
        .exists().bail().withMessage('La recherche est obligatoire')
        .isString().bail().withMessage('La recherche doit être une chaine de caractère')
        .trim()
        .isLength({ min: 1 }).bail().withMessage('La recherche doit faire au moins 1 caractère'),
];
