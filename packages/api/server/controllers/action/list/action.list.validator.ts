import { query } from 'express-validator';

export default [
    query('organizationId')
        .optional()
        .toInt()
        .isInt()
        .bail()
        .withMessage('L\'identifiant de structure doit être un nombre entier'),

    query('organizationId')
        .customSanitizer(value => value ?? null),
];
