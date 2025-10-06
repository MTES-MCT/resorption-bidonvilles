/* eslint-disable newline-per-chained-call */
import { query } from 'express-validator';
import geoModel from '#server/models/geoModel';
import { Location } from '#server/models/geoModel/Location.d';

export default [
    query('date')
        .toInt()
        .isInt()
        .bail()
        .withMessage('La date doit être un timestamp'),

    query('date')
        .customSanitizer((value) => {
            const d = new Date(value);
            d.setHours(0, 0, 0, 0);

            return d;
        })
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (value > today) {
                throw new Error('Vous ne pouvez pas générer un export pour une date future');
            }

            req.body.date = value;
            return true;
        }),

    // Placer le statut des sites exportés dans le body pour exploitation ultérieure par le contrôleur
    query('exportedSitesStatus')
        .exists({ checkNull: true }).bail().withMessage('Le statut des sites exportés est obligatoire')
        .isString()
        .isIn(['open', 'inProgress', 'closed', 'resorbed'])
        .custom((value, { req }) => {
            req.body.exportedSitesStatus = value;
            return true;
        }),

    query('locationType')
        .optional()
        .custom(async (type, { req }) => {
            const code = req.query.locationCode;
            if (!code) {
                throw new Error('Le code de la localisation demandée est obligatoire');
            }

            let location: Location;
            try {
                location = await geoModel.getLocation(type, code);
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
            req.body.location ??= {
                type: 'nation',
                region: null,
                departement: null,
                epci: null,
                city: null,
            } as Location;

            return true;
        }),

    query('options')
        .optional({ nullable: true })
        .isString().bail().withMessage('Les options sont au mauvais format')
        .trim()
        .customSanitizer(value => (value ? value.split(',') : []))
        .custom((value) => {
            if (value.some(option => !['address_details', 'owner', 'living_conditions', 'demographics', 'justice', 'actors', 'comments'].includes(option))) {
                throw new Error('Certaines options ne sont pas reconnues');
            }

            return true;
        }),

    query('options')
        .customSanitizer(value => (Array.isArray(value) ? value : [])),
];
