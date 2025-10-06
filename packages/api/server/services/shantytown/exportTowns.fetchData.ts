import moment from 'moment';
import { Location } from '#server/models/geoModel/Location.d';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import fetchPastData from './exportTowns.fetchPastData';
import fetchCurrentData from './exportTowns.fetchCurrentData';
import { ShantytownFilters } from '#root/types/resources/shantytownFilters.d';
import { ShantytownExportListOption } from '#root/types/resources/ShantytownExportTypes.d';

export default async (user: AuthUser, locations: Location[], exportedSitesStatus: ExportedSitesStatus, date: Date): Promise<Shantytown[]> => {
    const closedTowns = exportedSitesStatus !== 'close' && exportedSitesStatus !== 'inProgress';
    // export de données passées
    if (moment(date).format('YYYY-MM-DD') !== moment(new Date()).format('YYYY-MM-DD')) {
        return fetchPastData(user, locations, closedTowns, date);
    }

    // export de données actuelles
    return fetchCurrentData(user, locations, closedTowns);
};
