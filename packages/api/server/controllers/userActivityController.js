module.exports = models => ({
    async regular(req, res, next) {
        try {
            return res.status(200).send(
                await models.userActivity.getHistory(
                    req.user,
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

    async covid(req, res, next) {
        try {
            const results = await models.userActivity.getHistory(
                req.user,
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
