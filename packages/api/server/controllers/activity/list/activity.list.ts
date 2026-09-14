import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import getHistory from '#server/services/userActivity/getHistory';
import { Location } from '#server/models/geoModel/Location.d';
import { User } from '#root/types/resources/User.d';
import { HistoryActivityTypeFilter, HistoryResorbedFilter, HistoryMyTownsFilter } from '#root/types/resources/Activity.d';

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

interface ActivityListRequest extends Request {
    user: User,
    body: { location: Location },
}

type ActivityListQuery = {
    lastActivityDate?: string,
    maxActivityDate?: string,
    numberOfActivities: number,
    activityTypeFilter: HistoryActivityTypeFilter[],
    resorbedFilter: HistoryResorbedFilter[],
    myTownsFilter: HistoryMyTownsFilter[],
};

export default async (req: ActivityListRequest, res: Response, next: NextFunction) => {
    const {
        lastActivityDate, maxActivityDate, numberOfActivities, activityTypeFilter, resorbedFilter, myTownsFilter,
    } = req.query as unknown as ActivityListQuery;
    try {
        return res.status(200).send(
            await getHistory(
                req.user,
                req.body.location,
                { activityTypeFilter, resorbedFilter, myTownsFilter },
                numberOfActivities,
                moment(lastActivityDate).format('YYYY-MM-DD HH:mm:ss ZZ'),
                maxActivityDate ? moment(maxActivityDate).format('YYYY-MM-DD HH:mm:ss ZZ') : null,
            ),
        );
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError ?? error);
    }
};
