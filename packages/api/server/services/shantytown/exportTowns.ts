import moment from 'moment';
import ServiceError from '#server/errors/ServiceError';

import { Location } from '#server/models/geoModel/Location.d';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ShantytownExportListOption } from '#server/services/shantytown/_common/createExportSections';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import getAllowedLocations from './exportTowns.getAllowedLocations';
import fetchData from './exportTowns.fetchData';
import generateExportFile from './exportTowns.generateExportFile';
import saveStats from './exportTowns.saveStats';

export default async (user: AuthUser, location: Location, options: ShantytownExportListOption[] = [], closedTowns: boolean = false, date: Date = new Date()) => {
    const isPastExport = moment(date).format('YYYY-MM-DD') !== moment(new Date()).format('YYYY-MM-DD');

    const locations = getAllowedLocations(user, location, isPastExport);
    if (locations.length === 0) {
        throw new ServiceError(
            'permission_denied',
            new Error('Vous n\'êtes pas autorisé(e) à exporter les données sur le périmètre géographique demandé'),
        );
    }

    // on collecte les données et on génère le fichier excel
    let data: Shantytown[];
    try {
        data = await fetchData(user, locations, closedTowns, date);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (data.length === 0) {
        throw new ServiceError('fetch_failed', new Error('Il n\'y a aucun site à exporter pour le périmètre géographique demandé'));
    }

    const buffer = await generateExportFile(user, data, options, locations, closedTowns, date);

    // on enregistre cet export dans notre table de statistiques
    await saveStats(user, locations, closedTowns);

    return buffer;
};
