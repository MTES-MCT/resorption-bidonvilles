/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';
import questionTagModel from '#server/models/questionTagModel';


export default [
    body('question')
        .exists({ checkNull: true }).bail().withMessage('La question est obligatoire')
        .isString().bail().withMessage('La question doit être une chaîne de caractères')
        .trim()
        .isLength({ min: 1 }).bail().withMessage('La question ne peut être vide')
        .isLength({ max: 255 }).bail().withMessage('La question ne doit pas excéder 255 caractères'),

    body('details')
        .exists({ checkNull: true }).bail().withMessage('Le détail de la question est obligatoire')
        .isString().bail().withMessage('Le détail de la question doit être une chaîne de caractères')
        .trim()
        .isLength({ min: 1 }).bail().withMessage('Le détail de la question ne peut être vide'),

    body('people_affected')
        .optional({ nullable: true, checkFalsy: true })
        .toInt()
        .isInt().bail().withMessage('Le nombre d\'habitants concernés doit être un nombre entier')
        .isInt({ min: 1 }).withMessage('Le nombre d\'habitants concernés doit être strictement supérieur à zéro'),
    body('people_affected')
        .customSanitizer(value => (Number.isInteger(value) ? value : null)),

    body('other_tag')
        .if((value, { req }) => !req.body.tags.includes || !req.body.tags.includes('other'))
        .customSanitizer(() => null),
    body('other_tag')
        .if((value, { req }) => req.body.tags.includes && req.body.tags.includes('other'))
        .exists({ checkNull: true }).bail().withMessage('Le champ "Veuillez préciser votre thématique" est obligatoire')
        .isString().bail().withMessage('Le champ "Veuillez préciser votre thématique" doit être une chaîne de caractères')
        .trim()
        .isLength({ min: 1 }).bail().withMessage('Le champ "Veuillez préciser votre thématique" ne peut être vide')
        .isLength({ max: 255 }).bail().withMessage('Le champ "Veuillez préciser votre thématique" ne doit pas excéder 255 caractères'),

    body('tags')
        .customSanitizer((value) => {
            if (value === undefined || value === null) {
                return [];
            }

            return value;
        })
        .isArray().bail().withMessage('Le champ "Thématiques" doit être une liste de thématiques')
        .custom(async (value) => {
            if (value.length > 0) {
                let fullTags;
                try {
                    fullTags = await questionTagModel.findAll();
                } catch (error) {
                    throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Thématiques"');
                }

                const tags = fullTags.map(tag => tag.uid);
                if (!value.every((tag => tag === 'other' || tags.includes(tag)))) {
                    throw new Error('Certaines thématiques sélectionnées n\'existent pas en base de données');
                }
            }

            return true;
        })
        .customSanitizer(value => value.filter(tag => tag !== 'other')),
];