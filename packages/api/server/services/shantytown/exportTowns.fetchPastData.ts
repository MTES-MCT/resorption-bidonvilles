import moment from 'moment';
import shantytownModel from '#server/models/shantytownModel';
import { Location } from '#server/models/geoModel/Location.d';
import { User } from '#root/types/resources/User.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';

export default async (user: User, locations: Location[], closedTowns: boolean, date: Date): Promise<Shantytown[]> => shantytownModel.getHistoryAtGivenDate(
    user,
    locations,
    moment(date).format('YYYY-MM-DD HH:mm:ss ZZ'),
    closedTowns,
);
