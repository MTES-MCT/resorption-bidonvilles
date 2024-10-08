import ServiceError from '#server/errors/ServiceError';

import { AuthUser } from '#server/middlewares/authMiddleware';
import actionModel from '#server/models/actionModel';
import permissionUtils from '#server/utils/permission';
import { Nation } from '#server/models/geoModel/Location.d';
import generateExportFile from './exportActions.generateExportFile';
import { ActionReportRow } from '#root/types/resources/Action.d';

export default async (user: AuthUser, year: string) => {
    const nationalLevel: Nation = {
        type: 'nation', region: null, departement: null, epci: null, city: null,
    };

    if (!permissionUtils.can(user).do('export', 'action_comment').on(nationalLevel)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission d\'exporter les commentaires'));
    }

    // on collecte les données et on génère le fichier excel
    let data: ActionReportRow[];

    // Si l'année n'est pas précisée, calcul de l'année en cours
    let fetchedYear = new Date().getFullYear() - 1;
    if (year) {
        fetchedYear = parseInt(year, 10);
    }
    try {
        // Récupération des données
        data = await actionModel.fetchReport(fetchedYear);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (data.length === 0) {
        throw new ServiceError('fetch_failed', new Error('Il n\'y a aucune action à exporter'));
    }

    const buffer = await generateExportFile(user, data);
    return buffer;
};
