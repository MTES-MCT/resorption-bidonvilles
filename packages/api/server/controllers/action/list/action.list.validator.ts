import { query } from 'express-validator';

export default [
    query('organizationId')
        .customSanitizer(value => value ?? null)
        .if(value => value !== null)
        .isInt()
        .withMessage('L\'identifiant de structure doit être un nombre entier')
        .bail()
        .toInt(),
];
