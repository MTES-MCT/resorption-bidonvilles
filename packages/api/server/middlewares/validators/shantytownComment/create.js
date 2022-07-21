/* eslint-disable newline-per-chained-call */
const { body, param } = require('express-validator');
const shantytownModel = require('#server/models/shantytownModel');

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

    body('targets.organizations')
        .customSanitizer((value) => {
            if (value === null || value === undefined) {
                return [];
            }

            return value;
        })
        .isArray().bail().withMessage('Le format des structures ciblées n\'est pas valide'),

    body('targets.users')
        .customSanitizer((value) => {
            if (value === null || value === undefined) {
                return [];
            }

            return value;
        })
        .isArray().bail().withMessage('Le format des utilisateurs ciblés n\'est pas valide'),

];
