/* eslint-disable newline-per-chained-call */
const { query } = require('express-validator');
const { sequelize } = require('#db/models');
const geoModel = require('#server/models/geoModel')(sequelize);


// Check that user has at least one geographic national permission required for user activity
function hasNationalPermission(user) {
    const { permissions } = user;
    let has = false;
    if (user.isAllowedTo('list', 'shantytown')) {
        has = has || permissions.shantytown.list.geographic_level === 'nation';
    }
    if (user.isAllowedTo('list', 'shantytown_comment')) {
        has = has || permissions.shantytown_comment.list.geographic_level === 'nation';
    }
    if (user.isAllowedTo('listPrivate', 'shantytown_comment')) {
        has = has || permissions.shantytown_comment.listPrivate.geographic_level === 'nation';
    }

    return has;
}

function hasLocalPermission(user, location) {
    // Check if the org's location is the same type of requested location and if the code is the same
    return location[user.organization.location.type]
      && location[user.organization.location.type].code === user.organization.location[user.organization.location.type].code;
}

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

            // on vérifie que l'utilisateur a les droits pour accéder à ce périmètre géographique
            if (!hasNationalPermission(req.user) && !hasLocalPermission(req.user, location)) {
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
                if (hasNationalPermission(req.user)) {
                    req.body.location = geoModel.getLocation('nation');
                } else {
                    req.body.location = req.user.organization.location;
                }

                return null;
            }

            return value;
        }),
];
