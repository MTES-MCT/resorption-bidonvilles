/* eslint-disable newline-per-chained-call */
import { query } from 'express-validator';

export default [
    query('departement_code')
        .isString().bail().withMessage('Le département de recherche est invalide')
        .trim(),
];
