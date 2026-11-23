/* eslint-disable newline-per-chained-call */
import { query } from 'express-validator';

export default [
    query('parcelid')
        .notEmpty().bail().withMessage('L\'identifiant de la parcelle ne peut pas être vide')
        .isString().bail().withMessage('L\'identifiant de la parcelle doit être une chaîne de caractères'),
    query('departmentid')
        .notEmpty().bail().withMessage('L\'identifiant du département ne peut pas être vide')
        .isString().bail().withMessage('L\'identifiant du département doit être une chaîne de caractères'),
    query('shantytownId')
        .notEmpty().bail().withMessage('L\'identifiant du site ne peut pas être vide')
        .isInt().bail().withMessage('L\'identifiant du site doit être un entier'),
];
