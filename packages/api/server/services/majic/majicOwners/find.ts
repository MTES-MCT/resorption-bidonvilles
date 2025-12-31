import ServiceError from '#server/errors/ServiceError';
import majicModel from '#server/models/majicModel';
import majicLogsService from '#server/services/majicLogs';
import mails from '#server/mails/mails';
import { AuthUser } from '#server/middlewares/authMiddleware';
import permissionUtils from '#server/utils/permission';
import { Departement } from '#server/models/geoModel/Location.d';
import mattermostUtils from '#server/utils/mattermost';
import config from '#server/config';
import { RawParcel } from '#server/models/majicModel/findParcel/RawParcel.d';
import { RawOwner } from '#server/models/majicModel/findOwners/RawOwner.d';

export default async (parcelId: string, departementId: string, user: AuthUser) => {
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
    const shortParcelTableName = 'pnb10_parcelle';
    const shortOwnerTableName = 'proprietaire_droit_non_ano';
    const parcelTableName = `d${dept}_fftp_${majicYear}_${shortParcelTableName}`;
    const ownerTableName = `d${dept}_fftp_${majicYear}_${shortOwnerTableName}`;

    // Enregistrer la demande dans la table de logs
    try {
        await majicLogsService.insert(user.id, user.organization.id, parcelId);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        throw new ServiceError('log_insert_failed', new Error('Une erreur est survenue lors de l\'enregistrement de la demande.'));
    }

    // Récupérer le (la, les) propriétaire(s) de la parcelle
    let parcel: RawParcel;
    try {
        parcel = await majicModel.findParcel(parcelId, dept, schema, shortParcelTableName, parcelTableName);
        if (!parcel) {
            throw new ServiceError('parcel_fetch_failed', new Error('Impossible de retrouver la parcelle en base de données.'));
        }
    } catch (parcelError) {
        // eslint-disable-next-line no-console
        console.error(parcelError);
        if (parcelError.code === 'parcel_fetch_failed') {
            throw parcelError;
        }
        throw new ServiceError('parcel_fetch_failed', new Error(`Parcelle ${parcelId} introuvable dans la base des propriétaires fonciers non anonymisés.`));
    }

    // Récupérer la liste des propriétaires de la parcelle
    let owners: RawOwner[];
    try {
        owners = await majicModel.findOwners(parcel.idcom, parcel.dnupro, dept, schema, shortOwnerTableName, ownerTableName);
    } catch (ownersError) {
        // eslint-disable-next-line no-console
        console.error(ownersError);
        throw new ServiceError('owners_fetch_failed', new Error(`Une erreur s'est produite lors de la recherche des propiétaires de la parcelle ${parcelId}.`));
    }

    if (!owners) {
        throw new ServiceError('owner_fetch_failed', new Error(`Propriétaire de la parcelle ${parcelId} introuvable dans la base des propriétaires fonciers non anonymisés.`));
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
        // eslint-disable-next-line no-console
        console.error(e);
        throw new ServiceError('mail_send_failed', new Error('Une erreur est survenue lors de l\'envoi du courriel.'));
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
        // eslint-disable-next-line no-console
        console.error(e);
    }
};
