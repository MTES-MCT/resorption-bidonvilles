/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import actionModel from '#server/models/actionModel';

export default [
    param('id')
        .custom(async (value, { req }) => {
            let actions;
            try {
                actions = await actionModel.fetch([value], req.user.permissions.action_comment.create);
            } catch (error) {
                throw new Error('Impossible de retrouver l\'action concernée en base de données');
            }

            if (actions.length === 0) {
                throw new Error('L\'action concernée par le commentaire n\'existe pas');
            }

            [req.body.action] = actions;
            return true;
        }),

    body('description')
        .trim()
        .notEmpty().withMessage('La description est obligatoire'),
];
