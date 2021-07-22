module.exports = models => ({
    async regular(req, res, next) {
        try {
            const permissions = {
                'shantytown.list': null,
                'shantytown_comment.list': null,
                'shantytown_comment.listPrivate': null,
            };
            if (req.user.isAllowedTo('list', 'shantytown')) {
                permissions['shantytown.list'] = req.user.permissions.shantytown.list;
            }
            if (req.user.isAllowedTo('list', 'shantytown_comment')) {
                permissions['shantytown_comment.list'] = req.user.permissions.shantytown_comment.list;
            }
            if (req.user.isAllowedTo('listPrivate', 'shantytown_comment')) {
                permissions['shantytown_comment.listPrivate'] = req.user.permissions.shantytown_comment.listPrivate;
            }

            return res.status(200).send(
                await models.shantytown.getHistory(
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

    async covid(req, res, next) {
        try {
            let results = await models.shantytown.getHistory(
                req.user.permissions.shantytown.list,
                req.user.organization.location,
            );

            results = results.filter(({ covid, highCovid }) => (covid !== null && covid !== undefined) || (highCovid !== null && highCovid !== undefined));

            let allowedDepartements = null;
            if (req.user.permissions.covid_comment.list.geographic_level !== 'nation') {
                switch (req.user.organization.location.type) {
                    case 'nation':
                        break;

                    case 'region':
                    case 'epci':
                        allowedDepartements = (await models.geo
                            .getDepartementsFor(
                                req.user.organization.location.type,
                                req.user.organization.location[req.user.organization.location.type].code,
                            ))
                            .map(({ code }) => code);
                        break;

                    case 'departement':
                        allowedDepartements = [req.user.organization.location.departement.code];
                        break;

                    case 'city':
                        allowedDepartements = [req.user.organization.location.departement.code];
                        break;

                    default:
                        allowedDepartements = [];
                }
            }

            if (allowedDepartements !== null) {
                results = results.filter((row) => {
                    if (row.highCovid !== null) {
                        return row.highCovid.departements.some(({ code }) => allowedDepartements.indexOf(code) !== -1);
                    }

                    return allowedDepartements.indexOf(row.shantytown.departement) !== -1;
                });
            }

            return res.status(200).send(results);
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
