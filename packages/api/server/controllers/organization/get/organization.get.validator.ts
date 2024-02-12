/* eslint-disable newline-per-chained-call */
import { param } from 'express-validator';
import findOneById from '#server/models/organizationModel/findOneById';
import { Organization } from '#root/types/resources/Organization.d';

export default [
    param('id')
        .if(value => value !== 'search')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de la structure est invalide')
        .custom(async (value, { req }) => {
            let organization: Organization;
            try {
                organization = await findOneById(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la lecture en base de données');
            }

            if (organization === null) {
                throw new Error('La structure demandée n\'existe pas en base de données ou ne contient aucun utilisateur actif');
            }

            req.organization = organization;
            return true;
        }),
];
