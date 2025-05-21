/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de l\'utilisateur est invalide'),


    body('reason')
        .custom((value, { req }) => {
            const requestedUserId = parseInt(req.params.id, 10);
            const isModifyingOtherUser = requestedUserId !== req.user.id;

            if (isModifyingOtherUser) {
                if (!value || typeof value !== 'string') {
                    throw new Error('La raison doit être une chaîne de caractères');
                }

                if (value.trim().length === 0) {
                    throw new Error('La raison est obligatoire');
                }
            }

            return true;
        }),
];
