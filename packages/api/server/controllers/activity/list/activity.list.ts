import moment from 'moment';
import getHistory from '#server/services/userActivity/getHistory';

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    const {
        lastActivityDate, maxActivityDate, numberOfActivities, activityTypeFilter, resorbedFilter, myTownsFilter,
    } = req.query;
    try {
        return res.status(200).send(
            await getHistory(
                req.user,
                req.body.location,
                activityTypeFilter,
                resorbedFilter,
                myTownsFilter,
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
