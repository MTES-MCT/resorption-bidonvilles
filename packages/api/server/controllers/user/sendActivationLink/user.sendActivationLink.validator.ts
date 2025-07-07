/* eslint-disable newline-per-chained-call */
import { Meta, body, param } from 'express-validator';
import findOneUser from '#server/models/userModel/findOne';
import permissionsDescription from '#server/permissions_description';

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de l\'utilisateur est invalide')
        .custom(async (value, { req }) => {
            let user;
            try {
                user = await findOneUser(value, { extended: true }, req.user, 'activate');
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                throw new Error('Une erreur est survenue lors de la lecture en base de données');
            }

            if (user === null) {
                throw new Error('L\'utilisateur auquel envoyer un accès n\'a pas été trouvé en base de données');
            }

            if (user.status !== 'new') {
                throw new Error('L\'utilisateur concerné n\'a pas de demande d\'accès en attente');
            }

            req.userToBeActivated = user;
            return true;
        }),

    body('options')
        .customSanitizer((value) => {
            if (value === undefined || value === null) {
                return [];
            }

            return value;
        })
        .isArray().bail().withMessage('Les options sont invalides')
        .custom((value: string[], { req }: Meta) => {
            if (req.userToBeActivated === undefined) {
                throw new Error('Impossible de valider les options car l\'utilisateur n\'a pas été trouvé');
            }

            const availableOptions = permissionsDescription[req.userToBeActivated.role_id].options.map(({ id }) => id);
            const forbiddenOptions = value.filter(id => !availableOptions.includes(id));

            if (forbiddenOptions.length > 0) {
                throw new Error(`Certaines options ne sont pas disponibles pour l'utilisateur concerné : ${forbiddenOptions.join(', ')}`);
            }

            return true;
        }),
];
