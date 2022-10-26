/* eslint-disable newline-per-chained-call */
const { body } = require('express-validator');

module.exports = [
    body('page')
        .isString().bail().withMessage('Le nom de la page est invalide')
        .trim()
        .notEmpty().bail().withMessage('Le nom de la page est obligatoire'),
    body('domain')
        .isString().bail().withMessage('Le domaine est invalide')
        .isIn(['webapp', 'mobile']).bail().withMessage('La valeur du domaine est invalide'),

];
