/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import userModel from '#server/models/userModel';
import questionTagModel from '#server/models/questionTagModel';

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de l\'utilisateur est invalide')
        .custom(async (value, { req }) => {
            let user;
            try {
                user = await userModel.findOne(value);
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la recherche de l\'utilisateur en base de données');
            }

            if (user === null) {
                throw new Error('L\'utilisateur à mettre à jour est introuvable en base de données');
            }

            req.body.user = user;
            return true;
        }),

    body('tags')
        .customSanitizer((value) => {
            if (value === undefined || value === null) {
                return [];
            }

            return value;
        })
        .isArray().bail().withMessage('Le champ "Sujets" doit être une liste')
        .custom(async (value) => {
            if (value.length > 0) {
                let fullTags;
                try {
                    fullTags = await questionTagModel.findAll();
                } catch (error) {
                    throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Sujets"');
                }

                const tags = fullTags.map(tag => tag.uid);
                if (!value.every((tag => tags.includes(tag)))) {
                    throw new Error('Certains sujets sélectionnés n\'existent pas en base de données');
                }
            }

            return true;
        }),
];
