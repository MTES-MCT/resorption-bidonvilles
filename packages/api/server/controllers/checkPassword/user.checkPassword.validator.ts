/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';

export default [
    body('password')
        .isString()
        .trim()
        .custom((value, { req }) => {
            if (parseInt(req.params.id, 10) !== req.user.id) {
                throw new Error('Vous n\'avez pas les droits pour effectuer cette action.');
            }
            return true;
        }).bail()
        .notEmpty().withMessage('Le mot de passe est obligatoire').bail(),
];
