/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';

export default [
    body('ids')
        .isArray().bail().withMessage('Les identifiants des utilisateurs doivent être contenus dans un tableau'),
];
