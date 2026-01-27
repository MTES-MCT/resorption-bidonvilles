/* eslint-disable newline-per-chained-call */
import { param } from 'express-validator';
import shantytownModel from '#server/models/shantytownModel';
import { Shantytown } from '#root/types/resources/Shantytown.d';

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant du site est invalide')
        .custom(async (value, { req }) => {
            let shantytown: Shantytown | null;
            try {
                shantytown = await shantytownModel.findOne(req.user, value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la recherche du site en base de données');
            }

            if (shantytown === null) {
                throw new Error('Le site est introuvable en base de données');
            }

            if (shantytown.closedAt !== null) {
                throw new Error('Impossible de marquer un site fermé comme "Objectif résorption"');
            }

            if (shantytown.resorptionTarget !== null) {
                throw new Error('Ce site est déjà marqué comme "Objectif résorption"');
            }

            req.body.shantytown = shantytown;
            return true;
        }),
];
