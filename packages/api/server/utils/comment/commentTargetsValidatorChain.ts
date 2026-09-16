/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';
import organizationModel from '#server/models/organizationModel/index';
import userModel from '#server/models/userModel/index';

export const buildCommentTargetsValidatorChain = (getPrefEtDdetsLocation: (req: any) => any | undefined) => [
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

            if (req.body.targets.mode === 'pref_et_ddets') {
                const location = getPrefEtDdetsLocation(req);
                if (location) {
                    return organizationModel.findPrefAndDdets(location);
                }
            }

            return value;
        })
        .if((value, { req }) => req.body.targets?.mode && req.body.targets.mode !== 'public')
        .isArray().bail().withMessage('Le format des structures ciblées n\'est pas valide')
        .if(value => value.length > 0)
        .custom(async (value, { req }) => {
            // on vérifie, à minima, que les structures existent
            // il faudrait également vérifier que les structures en question ont l'accès en lecture
            // au site concerné par le commentaire
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
            // on vérifie, à minima, que les utilisateurs existent
            // il faudrait également vérifier que les utilisateurs en question ont l'accès en lecture
            // au site concerné par le commentaire
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

export default buildCommentTargetsValidatorChain;
