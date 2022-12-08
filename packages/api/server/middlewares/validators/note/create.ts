/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';
import noteModel from '#server/models/noteModel';
import { createdFrom } from '#server/models/noteModel/common/createdFrom';

export default [
    body('note_id')
        .custom(async (value) => {
            let note;
            try {
                note = await noteModel.findOneById(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de l\'accès en base de données');
            }

            if (note !== null) {
                throw new Error('La note existe déjà');
            }

            return true;
        }),

    body('created_from')
        .exists({ checkNull: true }).bail().withMessage('L\'origine de la note doit être renseignée.')
        .custom((value) => {
            if (!createdFrom.includes(value)) {
                throw new Error('L\'origine de la note n\'est pas reconnue.');
            }

            return true;
        }),

    body('number_of_copies')
        .optional({ nullable: true })
        .toInt()
        .isInt().bail().withMessage('Le champ "Nombre de copies" est invalide'),

    body('number_of_copies')
        .customSanitizer(value => (Number.isInteger(value) ? value : 0)),

    body('created_at')
        .exists({ checkNull: true }).bail().withMessage('La date de création de la note est obligatoire')
        .toDate()
        .custom((value) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const d = new Date(value);
            d.setHours(0, 0, 0, 0);
            if (d > today) {
                throw new Error('La date de création de la note ne peut pas être future');
            }

            return true;
        }),
];
