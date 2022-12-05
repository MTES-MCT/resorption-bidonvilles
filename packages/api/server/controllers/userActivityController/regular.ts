import moment from 'moment';
import userActivityModel from '#server/models/userActivityModel';

export default async (req, res, next) => {
    const {
        lastActivityDate, maxActivityDate, numberOfActivities, activityTypeFilter, resorbedFilter, myTownsFilter,
    } = req.query;
    try {
        return res.status(200).send(
            await userActivityModel.getHistory(
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
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue dans la lecture en base de données - regular.ts',
            },
        });
        return next(error);
    }
};
