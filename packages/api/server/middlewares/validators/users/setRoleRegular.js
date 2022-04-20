/* eslint-disable newline-per-chained-call */
const { body, param } = require('express-validator');
const roleModel = require('#server/models/roleModel')();
const userModel = require('#server/models/userModel');

module.exports = [
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
