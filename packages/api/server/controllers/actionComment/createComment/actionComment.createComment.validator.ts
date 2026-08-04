/* eslint-disable newline-per-chained-call */
import { body, param } from 'express-validator';
import actionModel from '#server/models/actionModel';
import userModel from '#server/models/userModel/index';
import organizationModel from '#server/models/organizationModel/index';

export default [
    param('id')
        .custom(async (value, { req }) => {
            let actions;
            try {
                actions = await actionModel.fetch(req.user, [value]);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                throw new Error('Impossible de retrouver l\'action concernée en base de données');
            }

            if (actions.length === 0) {
                throw new Error('L\'action concernée par le commentaire n\'existe pas');
            }

            [req.body.action] = actions;
            return true;
        }),

    body('description')
        .trim()
        .notEmpty().withMessage('La description est obligatoire'),

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

            if (req.body.targets.mode === 'pref_et_ddets' && req.body.action) {
                return organizationModel.findPrefAndDdets(req.body.action.location?.departement?.code);
            }

            return value;
        })
        .if((value, { req }) => req.body.targets?.mode && req.body.targets.mode !== 'public')
        .isArray().bail().withMessage('Le format des structures ciblées n\'est pas valide')
        .if(value => value.length > 0)
        .custom(async (value, { req }) => {
            const organizations = await organizationModel.findByIds(value.map(({ id }) => id), false, req.user);

            if (organizations.length !== value.length) {
                throw new Error('Une ou plusieurs structures ciblées n\'existent pas');
            }

            return true;
        }),

    body('targets.users')
        .customSanitizer((value, { req }) => {
            if (req.body.targets?.mode !== 'custom') {
                return [];
            }

            return value;
        })
        .if((value, { req }) => req.body.targets?.mode && req.body.targets.mode !== 'public')
        .isArray().bail().withMessage('Le format des utilisateurs ciblés n\'est pas valide')
        .if(value => value.length > 0)
        .custom(async (value) => {
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
];
