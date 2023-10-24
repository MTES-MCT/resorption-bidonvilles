/* eslint-disable newline-per-chained-call */
import { param } from 'express-validator';
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

            req.body.user = user;
            return true;
        }),
];
