module.exports = models => ({
    async regular(req, res, next) {
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

    // TODO: We fetch history then filter covid comments in JS, it would be more efficient to retrieve covid comments directly from SQL
    async covid(req, res, next) {
        try {
            // User might not have all permissions (ie: private comments), we check them before retrieving history
            const permissions = {
                'shantytown.list': false,
                'shantytown_comment.list': req.user.isAllowedTo('list', 'shantytown_comment') ? req.user.permissions.shantytown_comment.list : null,
                'shantytown_comment.listPrivate': req.user.isAllowedTo('listPrivate', 'shantytown_comment') ? req.user.permissions.shantytown_comment.listPrivate : null,
                'covid_comment.list': req.user.isAllowedTo('list', 'covid_comment') ? req.user.permissions.covid_comment.list : null,
            };

            const results = await models.userActivity.getHistory(
                req.user.organization.location,
                permissions,
                { type: 'nation' },
                ['shantytownComment', 'highCovidComment'],
            );

            return res.status(200).send(
                results.filter(({ comment, highCovidComment }) => highCovidComment || (comment && comment.covid)),
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
