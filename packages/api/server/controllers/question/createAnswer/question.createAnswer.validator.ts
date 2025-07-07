/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import questionModel from '#server/models/questionModel';

export default [
    param('id')
        .custom(async (value, { req }) => {
            let question;
            try {
                question = await questionModel.findOne(value);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                throw new Error('Impossible de retrouver la question concernée en base de données');
            }

            if (question === null) {
                throw new Error('La question concernée par la réponse n\'existe pas');
            }

            req.body.question = question;
            return true;
        }),

    body('description')
        .trim()
        .notEmpty().withMessage('La description est obligatoire'),

];
