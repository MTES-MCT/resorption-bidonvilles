/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';

export default [
    body('page')
        .isString().bail().withMessage('Le nom de la page est invalide')
        .trim()
        .notEmpty().bail().withMessage('Le nom de la page est obligatoire'),
    body('origin')
        .optional({ nullable: true })
        .isString().bail().withMessage('L\'origine doit être une chaîne de caractères')
        .trim(),
    body('origin')
        .customSanitizer(value => value ?? null),
];
