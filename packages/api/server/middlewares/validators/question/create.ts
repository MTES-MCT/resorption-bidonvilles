/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';
import questionTagModel from '#server/models/questionTagModel';


export default [
    body('question')
        .trim()
        .notEmpty().withMessage('La question est obligatoire'),
    body('details')
        .trim()
        .notEmpty().withMessage('Le détail de la question est obligatoire'),
    body('people_affected')
        .optional({ nullable: true })
        .toInt()
        .isInt().bail().withMessage('Le nombre d\'habitants concernés doit être un nombre entier')
        .isInt({ min: 0 }).withMessage('Le nombre d\'habitants concernés ne peut pas être négatif'),
    body('people_affected')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),
    body('other_tag')
        .customSanitizer((value) => {
            if (value === undefined) {
                return null;
            }
            return value;
        })
        .custom((value, { req }) => {
            if (value !== null && value.length > 255) {
                throw new Error('Le champ "Veuillez préciser votre thématique" ne doit pas excéder 255 caractères');
            }
            return true;
        })
        .custom((value, { req }) => {
            if (value !== null && !req.body.tags.includes('other')) {
                throw new Error('Le champ "Veuillez préciser votre thématique" ne peut être rempli que si la thématique Autre a été sélectionnée');
            }
            return true;
        })
        .custom((value, { req }) => {
            if (value === null && req.body.tags.includes('other')) {
                throw new Error('Le champ "Veuillez préciser votre thématique" ne peut être pas être vide  si la thématique Autre a été sélectionnée');
            }
            return true;
        }),
    body('tags')
        .customSanitizer((value) => {
            if (value === undefined || value === null) {
                return [];
            }
            return value;
        })
        .isArray().bail()
        .withMessage('Le champ "tags" est invalide')
        .custom(async (value) => {
            let fullTags = [];
            if (value.length > 0) {
                try {
                    fullTags = await questionTagModel.findAll();
                } catch (error) {
                    throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Tags"');
                }
                const tags = fullTags.map(tag => tag.uid);

                return value.every((tag) => {
                    if (tag !== 'other' && !tags.includes(tag)) {
                        throw new Error('Certains tags sélectionnés n\'existent pas en base de données');
                    }
                    return true;
                });
            }
            return true;
        })
        .customSanitizer(value => value.filter(tag => tag !== 'other')),

];
