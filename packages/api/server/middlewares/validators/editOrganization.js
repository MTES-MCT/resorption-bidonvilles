/* eslint-disable newline-per-chained-call */
const { body, param } = require('express-validator');
const organizationModel = require('#server/models/organizationModel')();

module.exports = [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de la structure est invalide')
        .custom(async (value, { req }) => {
            let organization;
            try {
                organization = await organizationModel.findOneById(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la recherche de la structure en base de données');
            }

            if (organization === null) {
                throw new Error('La structure à mettre à jour est introuvable en base de données');
            }

            req.body.organization = organization;
            return true;
        }),

    body('being_funded')
        .exists({ checkNull: true }).bail().withMessage('Le champ "Financement" est obligatoire')
        .isBoolean().bail().withMessage('Le champ "Financement" est invalide'),
];
