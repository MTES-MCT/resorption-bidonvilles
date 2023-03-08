import { param } from 'express-validator';
import actionModel from '#server/models/actionModel';
import writeAction from './writeAction';

export default [
    param('id')
        .toInt()
        .custom(async (value, { req }) => {
            let action;
            try {
                action = await actionModel.fetch([value], req.user.permissions.action.update);
            } catch (error) {
                throw new Error('Une erreur de lecture en base de données est survenue');
            }

            if (action === null) {
                throw new Error('L\'action à modifier n\'existe pas');
            }

            req.action = action;
        }),

    ...writeAction('update'),
];
