import { param } from 'express-validator';

export default [
    param('departement')
        .isString().bail().withMessage('Le département de recherche est invalide')
        .trim(),
];
