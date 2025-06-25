/* eslint-disable newline-per-chained-call */
import { param, query } from 'express-validator';
import geoModel from '#server/models/geoModel/index';
import type { Location as GeoLocation } from '#server/models/geoModel/Location';

export default [
    param('departement')
        .exists({ checkNull: true }).bail().withMessage('La localisation est obligatoire')
        .custom(async (value, { req }) => {
            let location: GeoLocation;
            try {
                location = await geoModel.getLocation('departement', value);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error('Erreur lors de la lecture en base de données:', e);
                throw new Error('Une erreur est survenue lors de la lecture en base de données');
            }

            if (location === null) {
                throw new Error('La localisation est introuvable');
            }

            req.location = location;
            return true;
        }),

    query('managers')
        .optional()
        .customSanitizer(value => value.split(',').map(id => parseInt(id, 10)))
        .isArray().withMessage('Les pilotes doivent être un tableau')
        .custom((value, { req }) => {
            if (!value.every(Number.isInteger)) {
                throw new Error('La liste des pilotes est invalide');
            }

            req.managers = value;
            return true;
        }),
];
