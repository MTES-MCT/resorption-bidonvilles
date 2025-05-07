/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import userModel from '#server/models/userModel';

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de l\'utilisateur est invalide')
        .custom(async (value, { req }) => {
            if (req.user.id === value) {
                req.body.user = req.user;
                return true;
            }

            let user;
            try {
                user = await userModel.findOne(value, undefined, req.user, 'deactivate');
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la lecture en base de données');
            }

            if (user === null) {
                throw new Error('L\'utilisateur n\'existe pas ou vous n\'avez pas les droits suffisants pour le désactiver');
            }

            if (user.status === 'inactive') {
                throw new Error('L\'accès de cet utilisateur est déjà désactivé');
            }

            req.body.user = user;
            return true;
        }),

    body('reason')
        .if((value, { req }) => req.body?.user?.id !== undefined && req.body.user.id !== req.user.id)
        .isString().withMessage('La raison doit être une chaîne de caractères')
        .trim()
        .notEmpty().withMessage('La raison est obligatoire'),

    body('anonymizationRequested')
        .if((value, { req }) => req.body?.user?.id !== undefined && req.body.user.id !== req.user.id)
        .isBoolean().withMessage('La demande d\'anonymisation n\'est pas valide'),
];
