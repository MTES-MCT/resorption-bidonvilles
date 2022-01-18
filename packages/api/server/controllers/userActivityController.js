const moment = require('moment');

module.exports = models => ({
    async regular(req, res, next) {
        const {
            lastActivityDate, numberOfActivities,
            filter, locationType,
            locationCode,
        } = req.query;
        const lastDate = new Date();
        if (lastActivityDate) {
            lastDate.setTime(lastActivityDate);
        }
        try {
            return res.status(200).send(
                await models.userActivity.getHistory(
                    req.user,
                    req.body.location,
                    locationType,
                    locationCode,
                    filter,
                    numberOfActivities,
                    moment(lastDate).format('YYYY-MM-DD HH:mm:ss ZZ'),
                ),
            );
        } catch (error) {
            res.status(500).send({
                error: {
                    developer_message: 'SQL query failed',
                    user_message: 'Une erreur est survenue dans la lecture en base de données',
                },
            });
            return next(error);
        }
    },
});
