/* eslint-disable newline-per-chained-call */
const { body, param } = require('express-validator');
const { sequelize } = require('#db/models');
const shantytownModel = require('#server/models/shantytownModel')(sequelize);

module.exports = [
    param('id')
        .custom(async (value, { req }) => {
            let shantytown;
            try {
                shantytown = await shantytownModel.findOne(req.user, value);
            } catch (error) {
                throw new Error('Impossible de retrouver le site concerné en base de données');
            }

            if (shantytown === null) {
                throw new Error('Le site concerné par le commentaire n\'existe pas');
            }

            req.body.shantytown = shantytown;
            return true;
        }),

    body('description')
        .trim()
        .notEmpty().withMessage('La description est obligatoire'),

    body('private')
        .customSanitizer(value => value !== false),
];
