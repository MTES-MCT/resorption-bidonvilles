/* eslint-disable newline-per-chained-call */

import { query } from 'express-validator';
import geoModel from '#server/models/geoModel';

export default [
    // number of activities
    query('numberOfActivities')
        .optional()
        .toInt()
        .isInt().bail().withMessage('Le nombre d\'activités est invalide')
        .custom((value) => {
            if (value !== -1 && value < 1) {
                throw new Error('Le nombre d\'activités ne peut être inférieur à 1');
            }

            return true;
        }),

    query('numberOfActivities')
        .customSanitizer(value => value || 10),

    // max activity date
    query('maxActivityDate')
        .optional()
        .toInt()
        .isInt().bail().withMessage('La date doit être un timestamp'),

    query('maxActivityDate')
        .customSanitizer(value => value || null),

    // last activity date
    query('lastActivityDate')
        .optional()
        .toInt()
        .isInt().bail().withMessage('La date doit être un timestamp'),

    query('lastActivityDate')
        .customSanitizer(value => value || Date.now()),

    // filter
    query('filter')
        .optional()
        .isString().bail().withMessage('La liste de filtre doit être une chaîne de caractères')
        .customSanitizer(value => value.split(','))
        .custom((value) => {
            const knownFilters = [
                'shantytownCreation',
                'shantytownClosing',
                'shantytownUpdate',
                'shantytownComment',
                'user',
                'actionComment',
            ];
            const unknownFilters = value.filter(s => !knownFilters.includes(s));

            if (unknownFilters.length > 0) {
                throw new Error(`Les filtres "${unknownFilters.join(',')}" n'existent pas`);
            }

            return true;
        }),

    query('filter')
        .customSanitizer(value => value || [
            'shantytownCreation',
            'shantytownClosing',
            'shantytownUpdate',
            'shantytownComment',
            'user',
            'actionComment',
        ]),

    // location (type and code)
    query('locationType')
        .optional()
        .custom(async (type, { req }) => {
            const code = req.query.locationCode;
            if (!code) {
                throw new Error('Le code de la localisation demandée est obligatoire');
            }

            let location;
            try {
                location = await geoModel.getLocation(type === 'metropole' ? 'nation' : type, code);
            } catch (e) {
                throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du périmètre géographique');
            }

            if (location === null) {
                throw new Error('Le périmètre géographique demandé n\'existe pas');
            }

            // on garde le périmètre en question dans le body pour exploitation ultérieure par le contrôleur
            req.body.location = location;
            return true;
        }),

    query('locationType')
        .custom((value, { req }) => {
            if (!req.body.location) {
                req.body.location = {
                    type: 'nation',
                    region: null,
                    departement: null,
                    epci: null,
                    city: null,
                };
            }

            return true;
        }),
];
