/* eslint-disable newline-per-chained-call */
const { body } = require('express-validator');
<<<<<<< HEAD
const sequelize = require('#db/sequelize');
<<<<<<< HEAD
<<<<<<< HEAD

=======
const themesValidator = require('./utils/themes');
>>>>>>> 2ada4146 ((1396) utilisation de #db/sequelize)
=======
>>>>>>> 1d277352 ((1396) feed: fix lint errors)
// models
const userModel = require('#server/models/userModel')(sequelize);
=======
const userModel = require('#server/models/userModel');
>>>>>>> 9d691b05 ((tests) import userModel as object)
const themesValidator = require('./utils/themes');

// models

module.exports = [
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
