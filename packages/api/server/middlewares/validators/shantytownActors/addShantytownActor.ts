/* eslint-disable newline-per-chained-call */
import * as expressValidator from 'express-validator';

// models
import userModelFactory from '#server/models/userModel';
import themesValidator from './utils/themes';

const { body } = expressValidator;
const userModel = userModelFactory();

export default [
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
                    throw new Error('Une erreur de lecture en base de données est survenue lors de la validation de l\'intervenant à ajouter');
                }

                if (user === null || user.status !== 'active') {
                    throw new Error('L\'intervenant à ajouter n\'existe pas en base de données');
                }
            }

            if (req.shantytown.actors.some(({ id }) => id === value)) {
                throw new Error(`${userModel.formatName(user)} fait déjà partie des intervenants`);
            }

            req.body.user = user;
            return true;
        }),

    themesValidator,
];
