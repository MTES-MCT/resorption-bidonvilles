/* eslint-disable newline-per-chained-call */
const { body, param } = require('express-validator');
const { sequelize } = require('#db/models');
const roleModel = require('#server/models/roleModel')(sequelize);
const userModel = require('#server/models/userModel')(sequelize);

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

            if (user.role === req.body.rolename) {
                throw new Error('Cet utilisateur a déjà le rôle qu\'on souhaite lui assigner');
            }

            return true;
        }),
    body('rolename')
        .custom(async (value, { req }) => {
            let regular_role;
            try {
                regular_role = await roleModel.findOneByName(value);
            } catch (error) {
                throw new Error('Impossible de retrouver le rôle concerné en base de données');
            }

            if (regular_role === null) {
                throw new Error('Le rôle associé à l\'utilisateur n\'existe pas');
            }

            if (regular_role.type !== 'regular') {
                throw new Error('Le rôle associé à l\'utilisateur n\'est pas autorisé');
            }

            req.body.roleregular = regular_role;
            return true;
        }),
];
