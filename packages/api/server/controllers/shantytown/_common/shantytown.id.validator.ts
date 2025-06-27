import { param } from 'express-validator';
import findOneShantytown from '#server/models/shantytownModel/findOne';

export default param('id')
    .custom(async (value, { req }) => {
        if (!req.user?.isAllowedTo('read', 'shantytown')) {
            throw new Error('Vous n\'avez pas accès à ces données');
        }

        try {
            req.shantytown = await findOneShantytown(req.user, parseInt(value, 10));
        } catch (error) {
            throw new Error('Une erreur de lecture en base de données est survenue');
        }

        if (req.shantytown === null) {
            throw new Error('Le site demandé n\'existe pas ou vous n\'y avez pas accès');
        }

        return true;
    });
