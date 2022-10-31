import moment from 'moment';
import userActivityModelFactory from '#server/models/userActivityModel';

const userActivityModel = userActivityModelFactory();

export default async (req, res, next) => {
    const {
        lastActivityDate, maxActivityDate, numberOfActivities, filter,
    } = req.query;

    try {
        return res.status(200).send(
            await userActivityModel.getHistory(
                req.user,
                req.body.location,
                filter,
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
