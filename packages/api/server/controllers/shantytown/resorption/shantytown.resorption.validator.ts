import { param } from 'express-validator';
import shantytownModel from '#server/models/shantytownModel';

export default [
    param('id')
        .custom(async (value, { req }) => {
            if (!req.user?.isAllowedTo('create', 'shantytown_resorption')) {
                throw new Error('Vous n\'avez pas le droit de démarrer une résorption');
            }

            try {
                req.shantytown = await shantytownModel.findOne(req.user, parseInt(value, 10));
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                throw new Error('Une erreur est survenue lors de la lecture du site en base de données');
            }

            if (req.shantytown === null) {
                throw new Error('Le site demandé n\'existe pas ou vous n\'y avez pas accès');
            }

            return true;
        }),
];
