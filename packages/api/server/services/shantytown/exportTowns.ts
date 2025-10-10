import moment from 'moment';
import ServiceError from '#server/errors/ServiceError';

import { Location } from '#server/models/geoModel/Location.d';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ShantytownExportListOption } from '#root/types/resources/ShantytownExportTypes.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import getAllowedLocations from './exportTowns.getAllowedLocations';
import fetchData from './exportTowns.fetchData';
import generateExportFile from './exportTowns.generateExportFile';
import saveStats from './exportTowns.saveStats';
import { ShantytownFilters } from '#root/types/resources/shantytownFilters.d';


export default async (
    user: AuthUser,
    location: Location,
    filters: ShantytownFilters,
    options: ShantytownExportListOption[] = [],
    date: Date = new Date(),
) => {
    const isPastExport = moment(date).format('YYYY-MM-DD') !== moment(new Date()).format('YYYY-MM-DD');

    const locations = getAllowedLocations(user, location, isPastExport);
    if (locations.length === 0) {
        throw new ServiceError(
            'permission_denied',
            new Error('Vous n\'êtes pas autorisé(e) à exporter les données sur le périmètre géographique demandé'),
        );
    }

    let data: Shantytown[];
    try {
        // Récupérer les données à exporter
        data = await fetchData(user, options, locations, filters, date);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (data.length === 0) {
        throw new ServiceError('fetch_failed', new Error('Il n\'y a aucun site à exporter pour le périmètre géographique demandé'));
    }

    // Générer le fichier Excel
    const buffer = await generateExportFile(user, data, options, locations, filters.exportedSitesStatus, date);

    // Enregistrer l'export dans la table de statistiques
    await saveStats(user, locations, filters.exportedSitesStatus);
    return buffer;
};
