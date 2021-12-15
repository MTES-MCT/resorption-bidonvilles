/* eslint-disable newline-per-chained-call */
const { query } = require('express-validator');
const geoModel = require('#server/models/geoModel')();

module.exports = [
    query('location')
        .optional({ nullable: true })
        .isString().bail().withMessage('Le périmètre géographique est invalide')
        .trim()
        .custom(async (value, { req }) => {
            // on vérifie que le périmètre géographique demandé existe
            const [type, code] = value.split(',');

            let location;
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

    // on définit un périmètre géographique par défaut si aucun n'a été donné
    query('location')
        .customSanitizer((value, { req }) => {
            if (!value) {
                req.body.location = geoModel.getLocation('nation');
                return null;
            }

            return value;
        }),
];
