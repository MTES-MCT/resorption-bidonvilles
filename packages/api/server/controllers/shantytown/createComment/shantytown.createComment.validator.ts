/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import shantytownModel from '#server/models/shantytownModel';
import userModel from '#server/models/userModel/index';
import organizationModel from '#server/models/organizationModel/index';
import commentTagModel from '#server/models/commentTagModel';

export default [
    param('id')
        .custom(async (value, { req }) => {
            let shantytown;
            try {
                shantytown = await shantytownModel.findOne(req.user, value);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
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

    body('targets.mode')
        .customSanitizer((value) => {
            if (value === null || value === undefined) {
                return 'public';
            }

            return value;
        })
        .custom((value) => {
            if (!['public', 'pref_et_ddets', 'custom'].includes(value)) {
                throw new Error('Le mode choisi pour la publication du message n\'est pas reconnu');
            }

            return true;
        }),

    body('targets.organizations')
        .customSanitizer(async (value, { req }) => {
            if (!req.body.targets || req.body.targets.mode === 'public') {
                return [];
            }

            if (req.body.targets.mode === 'pref_et_ddets' && req.body.shantytown) {
                return organizationModel.findPrefAndDdets(req.body.shantytown);
            }

            return value;
        })
        .if((value, { req }) => req.body.targets?.mode && req.body.targets.mode !== 'public')
        .isArray().bail().withMessage('Le format des structures ciblées n\'est pas valide')
        .if(value => value.length > 0)
        .custom(async (value) => {
            // on vérifie, à minima, que les structures existent
            // il faudrait également vérifier que les structures en question ont l'accès en lecture
            // au site concerné par le commentaire (@todo)
            const organizations = await organizationModel.findByIds(value.map(({ id }) => id));
            if (organizations.length !== value.length) {
                throw new Error('Une ou plusieurs structures ciblées n\'existent pas');
            }

            return true;
        }),

    body('targets.users')
        .customSanitizer((value, { req }) => {
            if (!req.body.targets || req.body.targets.mode !== 'custom') {
                return [];
            }

            return value;
        })
        .if((value, { req }) => req.body.targets?.mode && req.body.targets.mode !== 'public')
        .isArray().bail().withMessage('Le format des utilisateurs ciblés n\'est pas valide')
        .if(value => value.length > 0)
        .custom(async (value) => {
            // on vérifie, à minima, que les utilisateurs existent
            // il faudrait également vérifier que les utilisateurs en question ont l'accès en lecture
            // au site concerné par le commentaire (@todo)
            const users = await userModel.findByIds(null, value.map(({ id }) => id));
            if (users.length !== value.length) {
                throw new Error('Un ou plusieurs utilisateurs ciblés n\'existent pas');
            }

            return true;
        }),


    body('targets.mode')
        .if(value => value && value !== 'public')
        .custom((value, { req }) => {
            let total = 0;
            if (req.body.targets) {
                total += req.body.targets.organizations?.length ?? 0;
                total += req.body.targets.users?.length ?? 0;
            }

            if (total === 0) {
                throw new Error('Vous devez spécifier au moins une structure ou utilisateur cible(s)');
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
        .custom(async (value, { req }) => {
            let fullTags = [];
            if (value.length > 0) {
                try {
                    fullTags = await commentTagModel.find({
                        ids: value,
                    });
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error(error);
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
