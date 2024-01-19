/* eslint-disable newline-per-chained-call */
import { Meta, param } from 'express-validator';
import findOne from '#server/models/questionModel/findOne';
import Question from '#server/models/questionModel/Question';


export default [
    param('id')
        .custom(async (value:string, { req }:Meta):Promise<void> =>  {
            let question:Question;
            try {
                question = await findOne(parseInt(value, 10));
            } catch (error) {
                throw new Error('Une erreur de lecture en base de données est survenue');
            }

            if (question === null) {
                throw new Error('La question à supprimer n\'existe pas');
            }

            req.question = question;
        }),
];
