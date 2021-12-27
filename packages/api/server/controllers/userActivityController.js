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
            // User might not have all permissions (ie: private comments), we check them before retrieving history
            const permissions = {
                'shantytown.list': req.user.isAllowedTo('list', 'shantytown') ? req.user.permissions.shantytown.list : null,
                'shantytown_comment.list': req.user.isAllowedTo('list', 'shantytown_comment') ? req.user.permissions.shantytown_comment.list : null,
                'shantytown_comment.listPrivate': req.user.isAllowedTo('listPrivate', 'shantytown_comment') ? req.user.permissions.shantytown_comment.listPrivate : null,
                'covid_comment.list': req.user.isAllowedTo('list', 'covid_comment') ? req.user.permissions.covid_comment.list : null,
            };

            return res.status(200).send(
                await models.userActivity.getHistory(
                    req.user.organization.location,
                    permissions,
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
