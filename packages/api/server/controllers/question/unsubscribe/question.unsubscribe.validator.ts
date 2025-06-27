import questionModel from '#server/models/questionModel';
import { param } from 'express-validator';

export default [
    param('id')
        .custom(async (value, { req }) => {
            let question;
            try {
                question = await questionModel.findOne(parseInt(value, 10));
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                throw new Error('Une erreur de lecture en base de données est survenue');
            }

            if (question === null) {
                throw new Error('La question de laquelle se désabonner n\'existe pas');
            }

            req.question = question;
        }),
];
