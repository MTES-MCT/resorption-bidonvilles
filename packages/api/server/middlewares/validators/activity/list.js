/* eslint-disable newline-per-chained-call */
const { query } = require('express-validator');
const { sequelize } = require('#db/models');
const geoModel = require('#server/models/geoModel')(sequelize);

module.exports = [
    query('location')
        .optional({ nullable: true })
        .isString().bail().withMessage('Le périmètre géographique est invalide')
        .trim()
        .custom(async (value, { req }) => {
            // on vérifie que le périmètre géographique demandé existe
            const { type, code } = value.split(',');

            let location;
            try {
                location = await geoModel.getLocation(type, code);
            } catch (e) {
                throw new Error('Une erreur de lecture en base de données est survenue lors de la validation du périmètre géographique');
            }

            if (location === null) {
                throw new Error('Le périmètre géographique demandé n\'existe pas');
            }

            // on vérifie que l'utilisateur a les droits pour accéder à ce périmètre géographique
            if (req.user.permissions.shantytown.list.geographic_level !== 'nation'
                && location.type !== 'nation'
                && (!location[req.user.organization.location.type]
                    || location[req.user.organization.location.type].code !== req.user.organization.location[req.user.organization.location.type].code)) {
                throw new Error('Vous n\'avez pas les droits suffisants pour accéder à ces données sur ce territoire');
            }

            // on garde le périmètre en question dans le body pour exploitation ultérieure par le contrôleur
            req.body.location = location;
            return true;
        }),

    // on définit un périmètre géographique par défaut si aucun n'a été donné
    query('location')
        .customSanitizer((value, { req }) => {
            if (!value) {
                if (req.user.permissions.shantytown.list.geographic_level === 'nation') {
                    req.body.location = geoModel.getLocation('nation');
                } else {
                    req.body.location = req.user.organization.location;
                }

                return null;
            }

            return value;
        }),
];
