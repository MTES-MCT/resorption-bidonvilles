/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import shantytownModel from '#server/models/shantytownModel';

export default [
    param('id')
        .custom(async (value, { req }) => {
            let shantytown;
            try {
                shantytown = await shantytownModel.findOne(req.user, value);
            } catch (error) {
                throw new Error('Impossible de retrouver le site concerné en base de données');
            }

            if (shantytown === null) {
                throw new Error('Le site concerné par l\'arrêté n\'existe pas');
            }

            req.body.shantytown = shantytown;
            return true;
        }),
    body('')
        .custom((value, { req }) => {
            console.log('value');
            console.log('req');
            return true;
        }),
];
