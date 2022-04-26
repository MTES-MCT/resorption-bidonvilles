const statsModel = require('#server/models/statsModel');
const statsExportsModel = require('#server/models/statsExports');
const statsDirectoryViewsModel = require('#server/models/statsDirectoryViews');

module.exports = async (req, res) => {
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
        wau,
    ] = await Promise.all([
        statsModel.numberOfDepartements(),
        statsModel.numberOfActiveUsers(),
        statsModel.numberOfUsersAtMonth(startDate),
        statsModel.numberOfNewUsersPerMonth(startDate),
        statsModel.numberOfCollaboratorAndAssociationUsers(),
        statsModel.numberOfCollaboratorAndAssociationOrganizations(),
        statsModel.numberOfShantytownOperations(),
        statsExportsModel.count(),
        statsModel.numberOfComments(),
        statsDirectoryViewsModel.count(),
        statsModel.meanTimeBeforeCreationDeclaration(),
        statsModel.meanTimeBeforeClosingDeclaration(),
        statsModel.numberOfReviewedComments(),
        statsModel.wau(),
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
                wau,
            },
        },
    });
};
