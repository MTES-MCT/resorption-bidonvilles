const { body, param } = require('express-validator');
const sequelize = require('#db/sequelize');
const userModel = require('#server/models/userModel')(sequelize);

module.exports = [

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
