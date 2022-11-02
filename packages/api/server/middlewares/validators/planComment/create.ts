/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import planModel from '#server/models/planModel';

export default [
    param('id')
        .custom(async (value, { req }) => {
            let plan;
            try {
                plan = await planModel.findOne(req.user, value);
            } catch (error) {
                throw new Error('Impossible de retrouver l\'action concernée en base de données');
            }

            if (plan === null) {
                throw new Error('L\'action concernée par le commentaire n\'existe pas');
            }

            req.body.plan = plan;
            return true;
        }),

    body('description')
        .trim()
        .notEmpty().withMessage('La description est obligatoire'),

];
