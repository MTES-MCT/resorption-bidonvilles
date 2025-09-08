import { query } from 'express-validator';
import moment from 'moment';

export default [
    query('to')
        .exists({ checkNull: true }).bail().withMessage('La date de fin est obligatoire')
        .isDate()
        .bail()
        .withMessage('La date de fin doit être une date ISO')
        .toDate()
        .custom((value) => {
            const today = moment().set({
                hour: 0, minute: 0, second: 0, millisecond: 0,
            });
            const then = moment(value).set({
                hour: 0, minute: 0, second: 0, millisecond: 0,
            });

            if (then.isAfter(today)) {
                throw new Error('La date de fin ne peut pas être future');
            }

            return true;
        }),

    query('from')
        .exists({ checkNull: true }).bail().withMessage('La date de début est obligatoire')
        .isDate()
        .bail()
        .withMessage('La date de début doit être une date ISO')
        .toDate()
        .custom((value, { req }) => {
            if (!req.query.to) {
                return true;
            }

            const to = moment(req.query.to).set({
                hour: 0, minute: 0, second: 0, millisecond: 0,
            });
            const from = moment(value).set({
                hour: 0, minute: 0, second: 0, millisecond: 0,
            });

            if (from.isAfter(to)) {
                throw new Error('La date de début doit être antérieure à la date de fin');
            }

            return true;
        }),
];
