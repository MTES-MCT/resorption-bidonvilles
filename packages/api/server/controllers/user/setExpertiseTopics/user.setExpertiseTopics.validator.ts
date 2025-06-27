/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import userModel from '#server/models/userModel';
import expertiseTopicsModel from '#server/models/expertiseTopicsModel/index';
import { ExpertiseTopic } from '#root/types/resources/ExpertiseTopic.d';

export default [
    param('id')
        .toInt()
        .isInt().bail().withMessage('L\'identifiant de l\'utilisateur est invalide')
        .custom(async (value, { req }) => {
            if (req.user.id === value) {
                req.body.user = req.user;
                return true;
            }

            let user;
            try {
                user = await userModel.findOne(value, undefined, req.user, 'edit');
            } catch (error) {
                throw new Error('Une erreur est survenue lors de la recherche de l\'utilisateur en base de données');
            }

            if (user === null) {
                throw new Error('L\'utilisateur à mettre à jour est introuvable en base de données');
            }

            req.body.user = user;
            return true;
        }),

    body('expertise_topics')
        .customSanitizer((value) => {
            if (value === undefined || value === null) {
                return [];
            }

            return value;
        })
        .isArray().bail().withMessage('Le champ "Domaines de compétence" doit être une liste')
        .custom(async (value, { req }) => {
            if (value.length > 0) {
                try {
                    req.fullTopics = await expertiseTopicsModel.findAll();
                } catch (error) {
                    throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Domaines de compétence"');
                }

                const topicUids:string[] = req.fullTopics.map((topic: ExpertiseTopic) => topic.uid);
                if (!value.every((topic => topicUids.includes(topic)))) {
                    throw new Error('Certains domaines de compétence sélectionnés n\'existent pas en base de données');
                }
            }

            return true;
        }),

    body('interest_topics')
        .customSanitizer((value) => {
            if (value === undefined || value === null) {
                return [];
            }

            return value;
        })
        .isArray().bail().withMessage('Le champ "Sujets d\'intérêts" doit être une liste')
        .custom(async (value, { req }) => {
            if (value.length > 0) {
                if (!req.fullTopics) {
                    try {
                        req.fullTopics = await expertiseTopicsModel.findAll();
                    } catch (error) {
                        throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du champ "Sujets d\'intérêts"');
                    }
                }

                const topicUids:string[] = req.fullTopics.map((topic: ExpertiseTopic) => topic.uid);
                if (!value.every((topic => topicUids.includes(topic)))) {
                    throw new Error('Certains sujets d\'intérêts sélectionnés n\'existent pas en base de données');
                }
            }

            return true;
        }),

    body('expertise_comment')
        .optional({ nullable: true })
        .isString().bail().withMessage('Le champ "Vous souhaitez partager d\'autres informations ?" est invalide')
        .trim(),

    body('expertise_comment')
        .customSanitizer(value => value ?? null),
];
