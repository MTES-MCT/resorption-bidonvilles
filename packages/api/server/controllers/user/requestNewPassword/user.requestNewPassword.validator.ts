/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';

export default [
    body('email')
        .trim()
        .notEmpty().withMessage('Vous devez préciser le courriel')
        .isEmail().withMessage('Ce courriel n\'est pas valide'),
];
