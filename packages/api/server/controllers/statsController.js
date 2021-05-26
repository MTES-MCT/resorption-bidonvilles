const {
    Stats_Exports,
    Stats_Directory_Views,
} = require('#db/models');

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
            Stats_Exports.count(),
            models.stats.numberOfComments(),
            Stats_Directory_Views.count(),
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
            await Stats_Directory_Views.create({
                organization: organizationId,
                viewed_by: req.user.id,
                created_at: new Date(),
            });
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
});
