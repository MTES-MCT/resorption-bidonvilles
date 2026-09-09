import shantytownModel from '#server/models/shantytownModel';
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import userModel from '#server/models/userModel';
import actionModel from '#server/models/actionModel';
import ServiceError from '#server/errors/ServiceError';
import { Location } from '#server/models/geoModel/Location.d';
import { ServiceActivity } from '#root/types/services/ActivityService.d';
import {
    HistoryActivityTypeFilter,
    HistoryResorbedFilter,
    HistoryMyTownsFilter,
    HistoryShantytownFilter,
} from '#root/types/resources/Activity.d';
import { User } from '#root/types/resources/User.d';

type UserActivityHistoryFilters = {
    activityTypeFilter: HistoryActivityTypeFilter[],
    resorbedFilter: HistoryResorbedFilter[],
    myTownsFilter: HistoryMyTownsFilter[],
};

export default async function getHistory(
    user: User,
    location: Location,
    filters: UserActivityHistoryFilters,
    numberOfActivities: number,
    lastDate: Date | string,
    maxDate: Date | string | null,
): Promise<ServiceActivity[]> {
    const { activityTypeFilter, resorbedFilter, myTownsFilter } = filters;

    const promises = [];
    const shantytownFilter: HistoryShantytownFilter[] = [];

    if (activityTypeFilter.includes('shantytownCreation')) {
        shantytownFilter.push('shantytownCreation');
    }
    if (activityTypeFilter.includes('shantytownUpdate')) {
        shantytownFilter.push('shantytownUpdate');
    }
    if (activityTypeFilter.includes('shantytownClosing')) {
        shantytownFilter.push('shantytownClosing');
    }
    if (shantytownFilter.length > 0) {
        promises.push(shantytownModel.getHistory(user, location, { shantytownFilter, resorbedFilter, myTownsFilter }, numberOfActivities, lastDate, maxDate));
    }
    if (activityTypeFilter.includes('shantytownComment')) {
        promises.push(shantytownCommentModel.getHistory(user, location, numberOfActivities, lastDate, maxDate));
    }
    if (activityTypeFilter.includes('user')) {
        promises.push(userModel.getHistory(location, numberOfActivities, lastDate, maxDate));
    }
    if (activityTypeFilter.includes('actionComment')) {
        promises.push(actionModel.getCommentHistory(user, location, numberOfActivities, lastDate, maxDate));
    }

    let activities: ServiceActivity[];
    try {
        activities = await Promise.all(promises);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
    const sortedActivities = activities.flat().sort((a, b) => (a.date > b.date ? -1 : 1));

    if (numberOfActivities !== -1) {
        return sortedActivities.slice(0, numberOfActivities);
    }

    return sortedActivities;
}
