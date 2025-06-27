/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import permissionsDescription from '#server/permissions_description';
import userModel from '#server/models/userModel';

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de l\'utilisateur est invalide')
        .custom(async (value, { req }) => {
            let user;
            try {
                user = await userModel.findOne(value, undefined, req.user, 'activate');
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                throw new Error('Une erreur est survenue lors de la recherche de l\'utilisateur en base de données');
            }

            if (user === null) {
                throw new Error('L\'utilisateur à mettre à jour est introuvable en base de données');
            }

            req.body.user = user;
            return true;
        }),

    body('options')
        .customSanitizer(value => value ?? [])
        .isArray().bail().withMessage('La liste des options est techniquement invalide')
        .customSanitizer((value, { req }) => {
            if (!req.body.user) {
                return value;
            }

            const { options: allowedOptions } = permissionsDescription[req.body.user.role_id];
            return allowedOptions
                .filter(({ id }) => value.includes(id))
                .map(({ id }) => id);
        }),
];
