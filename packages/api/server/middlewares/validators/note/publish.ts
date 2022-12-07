import { body, param } from 'express-validator';
import noteModel from '#server/models/noteModel';
import shantytownModel from '#server/models/shantytownModel';

export default [
    body('note_id')
        .custom(async (value) => {
            let note;
            try {
                note = await noteModel.findOneById(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de l\'accès en base de données');
            }

            if (note === null) {
                throw new Error('Impossible de retrouver la note concernée en base de données');
            }

            return true;
        }),

    body('shantytown_id')
        .custom(async (value, { req }) => {
            let shantytown;
            try {
                shantytown = await shantytownModel.findOne(req.user, value);
            } catch (error) {
                console.log(error);
                throw new Error('Impossible de retrouver le site concerné en base de données');
            }

            if (shantytown === null) {
                throw new Error('Le site concerné par la note n\'existe pas');
            }

            return true;
        }),

    body('created_at')
        .exists({ checkNull: true }).bail().withMessage('La date de publication de la note est obligatoire')
        .isDate().bail().withMessage('La date de publication de la note est invalide')
        .toDate()
        .custom((value, { req }) => {
            value.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date de publication de la note ne peut pas être future');
            }

            return true;
        }),
];