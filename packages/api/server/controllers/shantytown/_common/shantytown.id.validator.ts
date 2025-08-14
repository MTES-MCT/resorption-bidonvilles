import { param } from 'express-validator';
import findOneShantytown from '#server/models/shantytownModel/findOne';
import shantytownParcelOwnerService from '#server/services/shantytownParcelOwner';
import serializeOwners from '#server/services/shantytownParcelOwner/serializeOwners';

export default param('id')
    .custom(async (value, { req }) => {
        if (!req.user?.isAllowedTo('read', 'shantytown')) {
            throw new Error('Vous n\'avez pas accès à ces données');
        }

        try {
            req.shantytown = await findOneShantytown(req.user, parseInt(value, 10));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            throw new Error('Une erreur de lecture en base de données est survenue');
        }

        try {
            const owners = await shantytownParcelOwnerService.find(req.user, req.shantytown) || null;
            req.shantytown.owner = owners.length > 0 ? await serializeOwners(req.user, owners, true) : {};
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            throw new Error('Une erreur est survenue lors de la récupération des propriétaires');
        }

        if (req.shantytown === null) {
            throw new Error('Le site demandé n\'existe pas ou vous n\'y avez pas accès');
        }

        return true;
    });
