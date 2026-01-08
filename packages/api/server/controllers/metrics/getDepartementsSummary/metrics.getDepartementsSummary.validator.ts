/* eslint-disable newline-per-chained-call */
import { query } from 'express-validator';

export default [
    query('departements')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('La liste des départements est obligatoire')
        .bail()
        .isString()
        .withMessage('La liste des départements est invalide')
        .bail()
        .trim()
        .customSanitizer(value => value.split(',').map(v => v.trim()).filter(Boolean))
        .custom((value, { req }) => {
            if (!Array.isArray(value) || value.length === 0) {
                throw new Error('La liste des départements est invalide');
            }

            if (value.some(v => typeof v !== 'string' || v.length === 0)) {
                throw new Error('La liste des départements est invalide');
            }

            req.query.departements = value;
            return true;
        }),
];
