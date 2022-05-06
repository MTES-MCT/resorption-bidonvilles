import moment from 'moment';
import ServiceError from '#server/errors/ServiceError';
import shantytownActorModel from '#server/models/shantytownActorModel';
import permissionUtils from '#server/utils/permission';

const { where: fWhere } = permissionUtils;

export default async (user) => {
    const permissionClauseGroup = fWhere().can(user).do('export', 'shantytown_actor');
    if (permissionClauseGroup === null) {
        return [];
    }

    const where = [];
    if (Object.keys(permissionClauseGroup).length > 0) {
        where.push([permissionClauseGroup]);
    }

    let actors;
    try {
        actors = await shantytownActorModel().findAllByLocation(where);
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
