/* eslint-disable newline-per-chained-call */
const { body, param } = require('express-validator');
const shantytownModel = require('#server/models/shantytownModel');

module.exports = [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant du site est invalide')
        .custom(async (value, { req }) => {
            let shantytown;
            try {
                shantytown = await shantytownModel.findOne(req.user, value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la recherche du site en base de données');
            }

            if (shantytown === null) {
                throw new Error('Le site est introuvable en base de données');
            }

            if (shantytown.status === 'open') {
                throw new Error('Ce site n\'est pas marqué comme fermé');
            }

            req.body.shantytown = shantytown;
            return true;
        }),

    body('closed_with_solutions')
        .isBoolean().bail().withMessage('Vous devez indiquer si le site a été résorbé définitivement')
        .customSanitizer(value => (value === true ? 'yes' : 'no')),


];
