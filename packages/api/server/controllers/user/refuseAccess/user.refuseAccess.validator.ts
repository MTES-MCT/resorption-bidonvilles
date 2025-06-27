/* eslint-disable newline-per-chained-call */
import { param } from 'express-validator';
import userModel from '#server/models/userModel';
import { User } from '#root/types/resources/User.d';

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de l\'utilisateur est invalide')
        .custom(async (value, { req }) => {
            if (req.user.id === value) {
                throw new Error('Vous ne pouvez pas classer sans suite votre propre accès');
            }

            let user: User;
            try {
                user = await userModel.findOne(value);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                throw new Error('Une erreur est survenue lors de la lecture en base de données');
            }

            if (user === null) {
                throw new Error('L\'utilisateur n\'existe pas ou vous n\'avez pas les droits suffisants pour le classer sans suite');
            }
            const inactiveStatus = ['inactive', 'refused'];
            if (inactiveStatus.includes(user.status)) {
                throw new Error('L\'accès de cet utilisateur ne peut pas être classé sans suite');
            }

            let requestingUser: User;
            try {
                requestingUser = await userModel.findOne(req.user.id);
                if (!requestingUser.is_superuser && requestingUser.role_id !== 'national_admin') {
                    throw new Error('Vous n\'avez pas le droit de classer cette demande sans suite');
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                throw new Error('Une erreur est survenue lors de la vérification de vos droits');
            }

            req.body.user = user;
            return true;
        }),
];
