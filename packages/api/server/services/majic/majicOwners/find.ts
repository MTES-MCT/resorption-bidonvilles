import ServiceError from '#server/errors/ServiceError';
import majicModel from '#server/models/majicModel';
import majicLogsService from '#server/services/majicLogs';
import mails from '#server/mails/mails';
import { AuthUser } from '#server/middlewares/authMiddleware';
import permissionUtils from '#server/utils/permission';
import { Departement } from '#server/models/geoModel/Location.d';
import mattermostUtils from '#server/utils/mattermost';
import config from '#server/config';

export default async (parcelId: string, departementId: string, user: AuthUser) => {
    // TODO: vérifier les droits de l'utilisateur => access.land_registry
    if (!permissionUtils.can(user).do('access', 'land_registry').on(
        { type: 'departement', departement: { code: departementId } } as Departement,
    )) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission d\'accéder au registre foncier.'));
    }

    // On trouve l'année de parution de la bdd
    const majicYear = await majicModel.getMajicYear();
    // On trouve le département concerné par la parcelle
    const dept = parcelId.substring(0, 2);

    // Composition du nom des tables
    const schema = `ff${majicYear}_dep`;
    const parcelTableName = `d${dept}_fftp_${majicYear}_pnb10_parcelle`;
    const ownerTableName = `d${dept}_fftp_${majicYear}_proprietaire_droit_non_ano`;

    // Enregistrer la demande dans la table de logs
    try {
        await majicLogsService.insert(user.id, user.organization.id, parcelId);
    } catch (e) {
        throw new ServiceError('log_insert_failed', new Error('Une erreur est survenue lors de l\'enregistrement de la demande.'));
    }

    // Récupérer le (la, les) propriétaire(s) de la parcelle
    const parcel = await majicModel.findParcel(parcelId, schema, parcelTableName);
    if (!parcel) {
        throw new ServiceError('parcel_fetch_failed', new Error('Impossible de retrouver la parcelle en base de données.'));
    }
    const owners = await majicModel.findOwners(parcel.idcom, parcel.dnupro, schema, ownerTableName);

    if (!owners) {
        throw new ServiceError('owner_fetch_failed', new Error(`Propriétaire de la parcelle ${parcelId} introuvable.`));
    }

    // Envoyer le mail
    try {
        await mails.sendParcelOwner(
            { email: user.email, first_name: user.first_name, last_name: user.last_name },
            {
                variables: {
                    parcel,
                    owners,
                    majicYear,
                },
            },
        );
    } catch (e) {
        throw new ServiceError('mail_send_failed', new Error('Une erreur est survenue lors de l\'envoi du courriel'));
    }

    // Envoyer la notification mattermost
    const { triggerLandRegistryRequest } = mattermostUtils;
    const { mattermost } = config;
    if (!mattermost) {
        return;
    }
    try {
        await triggerLandRegistryRequest(user, parcelId, majicYear);
    } catch (e) {
        // ignore
    }
};
