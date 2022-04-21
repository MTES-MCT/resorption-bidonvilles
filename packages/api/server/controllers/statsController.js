const JSONToCSV = require('json2csv');
const statsExportsModel = require('#server/models/statsExports');
const statsDirectoryViewsModel = require('#server/models/statsDirectoryViews');
const { getStats } = require('../models/statsModel')();

const groupByKey = (list, key) => list.reduce((hash, obj) => ({ ...hash, [obj[key]]: { ...hash[obj[key]], ...obj } }), {});

module.exports = models => ({
    all: async (req, res) => {
        const { departement } = req.params;

        const [
            numberOfPeople,
            numberOfShantytown,
            numberOfResorbedShantytown,
            numberOfPlans,
            numberOfUsers,
            numberOfClosedShantytownsPerMonth,
            numberOfNewShantytownsPerMonth,
            numberOfResorbedShantytownsPerMonth,
            numberOfCreditsPerYear,
            averageCompletionPercentage,
            numberOfShantytownsOnJune2019,
            populationTotal,
        ] = await Promise.all([
            models.stats.numberOfPeople(departement),
            models.stats.numberOfShantytown(departement),
            models.stats.numberOfResorbedShantytown(departement),
            models.stats.numberOfPlans(departement),
            models.stats.numberOfUsers(departement),
            models.stats.numberOfClosedShantytownsPerMonth(departement),
            models.stats.numberOfNewShantytownsPerMonth(departement),
            models.stats.numberOfResorbedShantytownsPerMonth(departement),
            models.stats.numberOfCreditsPerYear(departement),
            models.stats.averageCompletionPercentage(departement),
            models.stats.numberOfOpenShantytownsAtMonth(departement, '2019-06-01'),
            models.stats.populationTotal(departement),
        ]);

        return res.status(200).send({
            success: true,
            response: {
                statistics: {
                    numberOfPeople,
                    numberOfShantytown,
                    numberOfResorbedShantytown,
                    numberOfPlans,
                    numberOfUsers,
                    numberOfClosedShantytownsPerMonth,
                    numberOfNewShantytownsPerMonth,
                    numberOfResorbedShantytownsPerMonth,
                    numberOfCreditsPerYear,
                    averageCompletionPercentage,
                    numberOfShantytownsOnJune2019,
                    populationTotal,
                },
            },
        });
    },

    public: async (req, res) => {
        // date used for numberOfUsersPerMonth & numberOfUsersAtMonth
        const startDate = '2020-06-01';

        const [
            numberOfDepartements,
            numberOfActiveUsers,
            numberOfUsersOnJune2020,
            numberOfNewUsersPerMonth,
            numberOfCollaboratorAndAssociationUsers,
            numberOfCollaboratorAndAssociationOrganizations,
            numberOfShantytownOperations,
            numberOfExports,
            numberOfComments,
            numberOfDirectoryViews,
            meanTimeBeforeCreationDeclaration,
            meanTimeBeforeClosingDeclaration,
            numberOfReviewedComments,
        ] = await Promise.all([
            models.stats.numberOfDepartements(),
            models.stats.numberOfActiveUsers(),
            models.stats.numberOfUsersAtMonth(startDate),
            models.stats.numberOfNewUsersPerMonth(startDate),
            models.stats.numberOfCollaboratorAndAssociationUsers(),
            models.stats.numberOfCollaboratorAndAssociationOrganizations(),
            models.stats.numberOfShantytownOperations(),
            statsExportsModel.count(),
            models.stats.numberOfComments(),
            statsDirectoryViewsModel.count(),
            models.stats.meanTimeBeforeCreationDeclaration(),
            models.stats.meanTimeBeforeClosingDeclaration(),
            models.stats.numberOfReviewedComments(),
        ]);

        return res.status(200).send({
            success: true,
            response: {
                statistics: {
                    numberOfDepartements,
                    numberOfActiveUsers,
                    numberOfUsersOnJune2020,
                    numberOfNewUsersPerMonth,
                    numberOfCollaboratorAndAssociationUsers,
                    numberOfCollaboratorAndAssociationOrganizations,
                    numberOfShantytownOperations: Object.values(numberOfShantytownOperations)
                        .reduce((sum, rows) => sum + Object.values(rows).reduce((subtotal, { total }) => subtotal + parseInt(total, 10), 0), 0),
                    numberOfExports,
                    numberOfComments,
                    numberOfDirectoryViews,
                    meanTimeBeforeCreationDeclaration,
                    meanTimeBeforeClosingDeclaration,
                    numberOfReviewedComments,
                },
            },
        });
    },

    async directoryView(req, res, next) {
        const organizationId = parseInt(req.body.organization, 10);

        try {
            const organization = await models.organization.findOneById(organizationId);

            if (organization === null) {
                return res.status(400).send({
                    success: false,
                    response: {
                        error: {
                            user_message: 'La structure consultée n\'a pas été trouvéee en base de données',
                            developer_message: `Could not find the organization ${organizationId}`,
                        },
                    },
                });
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                response: {
                    error: {
                        user_message: 'Une erreur est survenue lors de la lecture en base de données',
                        developer_message: error.message,
                    },
                },
            });
            return next(error);
        }

        try {
            await statsDirectoryViewsModel.create(
                organizationId,
                req.user.id,
            );
        } catch (error) {
            res.status(500).send({
                success: false,
                response: {
                    error: {
                        user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
                        developer_message: error.message,
                    },
                },
            });
            return next(error);
        }

        return res.status(201).send({});
    },

    async export(req, res) {
        try {
            const [
                averageCompletion,
                people,
                plans,
                resorbedShantytowns,
                shantytowns,
                users,
            ] = await Promise.all([
                models.stats.averageCompletionPercentageByDepartement(),
                models.stats.numberOfPeopleByDepartement(),
                models.stats.numberOfPlansByDepartement(),
                models.stats.numberOfResorbedShantytownByDepartement(),
                models.stats.numberOfShantytownByDepartement(),
                models.stats.numberOfUsersByDepartement(),
            ]);

            const result = Object.values(groupByKey([
                ...averageCompletion.map(r => ({ Département: r.fk_departement, 'Taux de completion': `${(r.avg * 100).toFixed(2)}%` })),
                ...people.map(r => ({ Département: r.fk_departement, 'Nombre habitants': r.total })),
                ...plans.map(r => ({ Département: r.fk_departement, 'Nombre d\'actions': r.total })),
                ...resorbedShantytowns.map(r => ({ Département: r.fk_departement, 'Nombre de résorptions': r.total })),
                ...shantytowns.map(r => ({ Département: r.fk_departement, 'Nombre de sites': r.total })),
                ...users.filter(r => r.fk_departement !== null).map(r => ({ Département: r.fk_departement, "Nombre d'utilisateurs": r.count })),
            ], 'Département')).sort((a, b) => a.Département - b.Département);

            const csv = JSONToCSV.parse(result);

            // The frontend expect a JSON for every API calls, so we wrap the CSV in a json entry
            res.status(200).send({
                csv,
            });
        } catch (error) {
            res.status(500).send({
                error: {
                    user_message: 'Une erreur est survenue lors de la récupération des données en base',
                    developer_message: error.message,
                },
            });
        }
    },
    async getDashboardStats(req, res, next) {
        const { location } = req.body;
        try {
            const townStats = await getStats(req.user, location);
            return res.status(200).send(townStats);
        } catch (error) {
            res.status(500).send({
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
            });
            return next(error);
        }
    },
});
