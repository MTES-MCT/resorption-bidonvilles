module.exports = models => ({
    async regular(req, res, next) {
        const {
            lastActivityDate, numberActivities,
            filter, locationType,
            locationCode,
        } = req.query;
        const lastDate = new Date();
        if (lastActivityDate) {
            lastDate.setTime(lastActivityDate * 1000);
        }
        try {
            return res.status(200).send(
                await models.userActivity.getHistory(
                    req.user,
                    req.body.location,
                    locationType,
                    locationCode,
                    filter,
                    numberActivities,
                    `${lastDate.toISOString().slice(0, 10)} ${lastDate.toTimeString().replace('GMT', '').slice(0, 14)}`,
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
