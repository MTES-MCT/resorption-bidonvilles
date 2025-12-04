/* eslint-disable newline-per-chained-call */
import { query } from 'express-validator';
import shantytownIdValidator from '#server/controllers/shantytown/_common/shantytown.id.validator';

export default [
    shantytownIdValidator,

    query('options')
        .optional({ nullable: true })
        .isString().bail().withMessage('Les options sont au mauvais format')
        .trim()
        .customSanitizer(value => (value ? value.split(',') : []))
        .custom((value) => {
            if (value.some(option => !['actors', 'actions', 'justice', 'comments', 'history', 'resorption_phases'].includes(option))) {
                throw new Error('Certaines options ne sont pas reconnues');
            }

            return true;
        }),

    query('options')
        .customSanitizer(value => (Array.isArray(value) ? value : [])),
];
