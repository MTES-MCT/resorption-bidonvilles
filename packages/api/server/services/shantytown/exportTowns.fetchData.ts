import moment from 'moment';
import { Location } from '#server/models/geoModel/Location.d';
import { User } from '#root/types/resources/User.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import fetchPastData from './exportTowns.fetchPastData';
import fetchCurrentData from './exportTowns.fetchCurrentData';

export default async (user: User, locations: Location[], closedTowns: boolean, date: Date): Promise<Shantytown[]> => {
    // export de données passées
    if (moment(date).format('YYYY-MM-DD') !== moment(new Date()).format('YYYY-MM-DD')) {
        return fetchPastData(user, locations, closedTowns, date);
    }

    // export de données actuelles
    return fetchCurrentData(user, locations, closedTowns);
};
