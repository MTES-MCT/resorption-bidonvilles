import { param } from 'express-validator';
import geoModel from '#server/models/geoModel/index';

export default [
    param('locationType')
        .exists({ checkNull: true }).bail().withMessage('Le type de localisation est obligatoire')
        .custom((value) => {
            if (!['region', 'departement', 'epci', 'city'].includes(value)) {
                throw new Error('Le type de localisation n\'est pas reconnu');
            }

            return true;
        }),

    param('locationCode')
        .exists({ checkNull: true }).bail().withMessage('La localisation est obligatoire')
        .custom(async (value, { req }) => {
            let location;
            try {
                location = await geoModel.getLocation(req.params.locationType, value);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
                throw new Error('Une erreur est survenue lors de la lecture en base de données');
            }

            if (location === null) {
                throw new Error('La localisation est introuvable');
            }

            req.body.location = location;
            return true;
        }),
];
