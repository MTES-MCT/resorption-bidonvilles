import { body, param } from 'express-validator';
import noteModel from '#server/models/noteModel';
import { createdFrom } from "#server/models/noteModel/common/createdFrom";
import userModel from '#server/models/userModel';

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
        .customSanitizer((value) => {
            if (value === null || value === undefined) {
                throw new Error('L\origine de la note doit être renseignée.');
            }

            return value;
        })
        .custom((value) => {
            if (!createdFrom.includes(value)) {
                throw new Error('L\origine de la note n\'est pas reconnue.');
            }

            return true;
        }),

    body('number_of_copies')
        .customSanitizer(value => (Number.isInteger(value) ? value : 0)),

    body('created_by')
        .custom(async (value) => {
            // on vérifie que l'utilisateur existe
            const users = await userModel.findByIds(null, value);
            if (users.length < 1) {
                throw new Error('l\'auteur de la note n\'existe pas');
            }

            return true;
        }),

    body('created_at')
        .exists({ checkNull: true }).bail().withMessage('La date de création de la note est obligatoire')
        .isDate().bail().withMessage('La date de création de la note est invalide')
        .toDate()
        .custom((value, { req }) => {
            value.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('La date de création de la note ne peut pas être future');
            }

            return true;
        }),
];