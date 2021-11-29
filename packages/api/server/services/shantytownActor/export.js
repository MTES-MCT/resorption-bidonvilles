const moment = require('moment');
const ServiceError = require('#server/errors/ServiceError');
const shantytownActorModel = require('#server/models/shantytownActorModel');

module.exports = async (user) => {
    if (!user.permissions || !user.permissions.shantytown_actor || !user.permissions.shantytown_actor.export) {
        return [];
    }

    const { allowed, geographic_level: allowedLevel } = user.permissions.shantytown_actor.export;
    if (!allowed) {
        return [];
    }

    let location = null;
    const { organization: { location: userLocation } } = user;
    if (allowedLevel !== 'nation' && userLocation.type !== 'nation') {
        if (userLocation.type === 'region') {
            location = { type: 'region', ...userLocation.region };
        } else {
            location = { type: 'departement', ...userLocation.departement };
        }
    }

    let actors;
    try {
        actors = await shantytownActorModel().findAllByLocation(location);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return actors.map((row) => {
        const createdAt = moment(row.created_at).utcOffset(2);

        return {
            S: createdAt.format('w'),
            'Identifiant du site': row.shantytownId,
            "Identifiant de l'utilisateur": row.userId,
            Email: row.userEmail,
            Prénom: row.userFirstName,
            'Nom de famille': row.userLastName,
            'Marqué(e) intervenant(e) le': createdAt.format('DD/MM/YYYY'),
            "Champs d'intervention": row.themes,
            Département: row.departementName,
            Structure: row.organizationAbbreviation || row.organizationName,
            Role: row.userRole,
            'Objectif de résorption': row.shantytownResorptionTarget,
        };
    });
};
