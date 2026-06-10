import { query } from 'express-validator';

export default [
    query('organizationId')
        .customSanitizer(value => value ?? null)
        .if(value => value !== null)
        .toInt()
        .isInt()
        .bail()
        .withMessage('L\'identifiant de structure doit être un nombre entier'),
];
