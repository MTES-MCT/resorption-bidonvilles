/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import shantytownModel from '#server/models/shantytownModel';
import commentTagModel from '#server/models/commentTagModel';
import { buildCommentTargetsValidatorChain } from '#server/utils/comment/commentTargetsValidatorChain';

export default [
    param('id')
        .custom(async (value, { req }) => {
            let shantytown;
            try {
                shantytown = await shantytownModel.findOne(req.user, value);
            } catch {
                throw new Error('Impossible de retrouver le site concerné en base de données');
            }

            if (shantytown === null) {
                throw new Error('Le site concerné par le commentaire n\'existe pas');
            }

            req.body.shantytown = shantytown;
            return true;
        }),

    body('comment')
        .trim()
        .notEmpty().withMessage('Le message est obligatoire'),

    ...buildCommentTargetsValidatorChain(req => req.body.shantytown),

    body('tags')
        .customSanitizer((value) => {
            if (value === undefined || value === null) {
                return [];
            }
            return value;
        })
        .isArray().bail()
        .withMessage('Le champ "tags" est invalide')
        .custom(async (value, { req }) => {
            let fullTags = [];
            if (value.length > 0) {
                try {
                    fullTags = await commentTagModel.find({
                        ids: value,
                    });
                } catch {
                    throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Tags"');
                }

                if (fullTags.length !== value.length) {
                    throw new Error('Certains tags sélectionnés n\'existent pas en base de données');
                }
            }
            req.tags = fullTags;
            return true;
        }),
];
