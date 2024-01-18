/* eslint-disable newline-per-chained-call */
import { body } from 'express-validator';
import geoModel from '#server/models/geoModel/index';

export default [
    body('departement')
        .exists({ checkNull: true }).bail().withMessage('La localisation est obligatoire')
        .custom(async (value, { req }) => {
            let location;
            try {
                location = await geoModel.getLocation('departement', value);
            } catch (e) {
                throw new Error('Une erreur est survenue lors de la lecture en base de données');
            }

            if (location === null) {
                throw new Error('La localisation est introuvable');
            }

            req.body.location = location;
            return true;
        }),

    body('managers')
        .optional()
        .isArray().withMessage('Les pilotes doivent être un tableau')
        .custom(value => value.every(Number.isInteger))
        .withMessage('La liste des pilotes est invalide'),
];
