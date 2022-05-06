import * as expressValidator from 'express-validator';
import userModelFactory from '#server/models/userModel';

const { body, param } = expressValidator;
const userModel = userModelFactory();

export default [

    body('comment')
        .optional({ nullable: true })
        .isString().bail()
        .withMessage('Le commentaire est invalide')
        .trim(),

    body('comment')
        .customSanitizer(value => value || null),

    param('id')
        .toInt()
        .isInt().bail()
        .withMessage('L\'identifiant de l\'utilisateur est invalide')
        .custom(async (value) => {
            let user = null;
            try {
                user = await userModel.findOne(value, { auth: true });
            } catch (error) {
                throw new Error('Erreur lors du contrôle de l\'existence de l\'utlisateur à partir de son identifiant');
            }

            if (user === null) {
                throw new Error('L\'utlisateur n\'existe pas en base de données');
            }
        }),
];
