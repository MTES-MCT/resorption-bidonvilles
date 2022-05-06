/* eslint-disable newline-per-chained-call */
import * as expressValidator from 'express-validator';
import roleModelFactory from '#server/models/roleModel';
import userModelFactory from '#server/models/userModel';

const { body, param } = expressValidator;
const roleModel = roleModelFactory();
const userModel = userModelFactory();

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de l\'utilisateur est invalide')
        .custom(async (value, { req }) => {
            let user;
            try {
                user = await userModel.findOne(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la recherche de l\'utilisateur en base de données');
            }

            if (user === null) {
                throw new Error('L\'utilisateur à mettre à jour est introuvable en base de données');
            }

            req.body.user = user;
            return true;
        }),

    body('role_id')
        .exists().bail().withMessage('Le rôle à assigner à l\'utilisateur est obligatoire')
        .isString().bail().withMessage('Le rôle à assigner à l\'utilisateur est invalide')
        .custom(async (value, { req }) => {
            let role;
            try {
                role = await roleModel.findOne(value, 'regular');
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la recherche du rôle en base de données');
            }

            if (role === null) {
                throw new Error('Le rôle à assigner à l\'utilisateur n\'existe pas');
            }

            req.body.role = role;
            return true;
        }),
];
