/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';
import userModel from '#server/models/userModel';
import themesValidator from '#server/controllers/shantytown/_common/shantytown.actorThemes.validator';
import shantytownIdValidator from '#server/controllers/shantytown/_common/shantytown.id.validator';

export default [
    shantytownIdValidator,

    body('user_id')
        .exists({ checkNull: true }).bail().withMessage('L\'identifiant de l\'intervenant est obligatoire')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de l\'intervenant est invalide')
        .custom(async (value, { req }) => {
            let user;
            if (req.user.id === value) {
                ({ user } = req);
            } else {
                try {
                    user = await userModel.findOne(value);
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error(error);
                    throw new Error('Une erreur de lecture en base de données est survenue lors de la validation de l\'intervenant à ajouter');
                }

                if (user === null || user.status !== 'active') {
                    throw new Error('L\'intervenant à ajouter n\'existe pas en base de données');
                }
            }

            if (!req.shantytown?.actors || req.shantytown.actors.some(({ id }) => id === value)) {
                throw new Error(`${userModel.formatName(user)} fait déjà partie des intervenants`);
            }

            req.body.user = user;
            return true;
        }),

    themesValidator,
];
