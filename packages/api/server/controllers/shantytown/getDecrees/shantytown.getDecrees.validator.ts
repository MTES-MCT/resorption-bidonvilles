import { param } from 'express-validator';

export default param('id')
    .custom(async (value, { req }) => {
        if (!req.user || !req.user.isAllowedTo('read', 'shantytown')) {
            throw new Error('Vous n\'avez pas accès à ces données');
        }

        return true;
    });
