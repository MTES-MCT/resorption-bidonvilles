/* eslint-disable newline-per-chained-call */
import { param } from 'express-validator';
import userAccessModel from '#server/models/userAccessModel';

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de l\'utilisateur est invalide')
        .custom(async (value, { req }) => {
            let userAccess;
            try {
                userAccess = await userAccessModel.findLatestUserAccess(value);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                throw new Error('Une erreur est survenue lors de la recherche de l\'utilisateur en base de données');
            }

            if (userAccess === null) {
                throw new Error('Impossible de trouver un accès envoyé encore valide pour cet utilisateur');
            }

            req.body.userAccess = userAccess;
            return true;
        }),
];
