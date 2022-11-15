/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';

export default [
    body('page')
        .isString().bail().withMessage('Le nom de la page est invalide')
        .trim()
        .notEmpty().bail().withMessage('Le nom de la page est obligatoire'),
    body('domain')
        .isString().bail().withMessage('Le domaine est invalide')
        .isIn(['webapp', 'mobile']).bail().withMessage('La valeur du domaine est invalide'),

];
