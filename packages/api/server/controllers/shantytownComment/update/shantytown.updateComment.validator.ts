/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import shantytownModel from '#server/models/shantytownModel';

export default [
    param('id')
        .custom(async (value, { req }) => {
            let shantytown;
            try {
                shantytown = await shantytownModel.findOne(req.user, value);
            } catch {
                throw new Error('Impossible de retrouver le site concerné en base de données');
            }

            if (shantytown === null) {
                throw new Error('Le site concerné par le commentaire n\'existe pas');
            }

            req.body.shantytown = shantytown;
            return true;
        }),

    body('comment')
        .trim()
        .notEmpty().withMessage('Le message est obligatoire'),
];
