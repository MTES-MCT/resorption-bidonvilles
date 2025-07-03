/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import shantytownModel from '#server/models/shantytownModel';

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant du site est invalide')
        .custom(async (value, { req }) => {
            let shantytown;
            try {
                shantytown = await shantytownModel.findOne(req.user, value);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                throw new Error('Une erreur est survenue lors de la recherche du site en base de données');
            }

            if (shantytown === null) {
                throw new Error('Le site est introuvable en base de données');
            }

            if (shantytown.status === 'closed') {
                throw new Error('Impossible de notifier une canicule sur un site fermé');
            }

            req.body.shantytown = shantytown;
            return true;
        }),

    body('heatwave_status')
        .isBoolean().bail().withMessage('Vous devez indiquer si le site subit une canicule'),


];
