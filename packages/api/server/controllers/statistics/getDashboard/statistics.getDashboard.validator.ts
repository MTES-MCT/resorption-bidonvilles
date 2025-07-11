/* eslint-disable newline-per-chained-call */

import { query } from 'express-validator';
import geoModel from '#server/models/geoModel';

export default [
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
                location = await geoModel.getLocation(type, code);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
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
            };

            return true;
        }),
];
