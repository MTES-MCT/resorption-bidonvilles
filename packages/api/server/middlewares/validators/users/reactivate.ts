/* eslint-disable newline-per-chained-call */
import { param } from 'express-validator';
import userModel from '#server/models/userModel';
import { SerializedUser } from '#server/models/userModel/_common/types/SerializedUser.d';

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de l\'utilisateur est invalide')
        .custom(async (value, { req }) => {
            if (req.user.id === value) {
                throw new Error('Vous ne pouvez pas réactiver votre propre accès');
            }

            let user: SerializedUser;
            try {
                user = await userModel.findOne(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la lecture en base de données');
            }

            if (user === null) {
                throw new Error('L\'utilisateur n\'existe pas ou vous n\'avez pas les droits suffisants pour le désactiver');
            }

            if (user.status !== 'inactive') {
                throw new Error('L\'accès de cet utilisateur est déjà actif');
            }

            req.body.user = user;
            return true;
        }),
];
