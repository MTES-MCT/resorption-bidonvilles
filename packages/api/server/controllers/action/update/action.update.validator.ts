import { param } from 'express-validator';
import actionModel from '#server/models/actionModel';
import writeAction from '#server/controllers/action/_common/action.write.validator';

export default [
    param('id')
        .toInt()
        .custom(async (value, { req }) => {
            let action;
            try {
                action = await actionModel.fetch(req.user, [value]);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                throw new Error('Une erreur de lecture en base de données est survenue');
            }

            if (action.length !== 1) {
                throw new Error('L\'action à modifier n\'existe pas');
            }

            [req.action] = action;
        }),

    ...writeAction('update'),
];
