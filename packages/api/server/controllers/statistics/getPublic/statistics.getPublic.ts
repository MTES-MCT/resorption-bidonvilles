import statsModel from '#server/models/statsModel';
import statsExportsModel from '#server/models/statsExportsModel';
import statsDirectoryViewsModel from '#server/models/statsDirectoryViewsModel';

export default async (req, res) => {
    // date used for numberOfUsersPerMonth & numberOfUsersAtMonth
    const startDate = '2020-06-01';

    const [
        numberOfDepartements,
        numberOfActiveUsers,
        numberOfUsersOnJune2020,
        numberOfActiveUsersPerMonth,
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
        statsModel.numberOfActiveUsersPerMonth(startDate),
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
        statistics: {
            numberOfDepartements,
            numberOfActiveUsers,
            numberOfUsersOnJune2020,
            numberOfActiveUsersPerMonth,
            numberOfNewUsersPerMonth,
            numberOfCollaboratorAndAssociationUsers,
            numberOfCollaboratorAndAssociationOrganizations,
            numberOfShantytownOperations: Object.values(numberOfShantytownOperations)
                .reduce((sum, rows) => sum + Object.values(rows).reduce((subtotal, { total }: any) => subtotal + parseInt(total, 10), 0), 0),
            numberOfExports,
            numberOfComments,
            numberOfDirectoryViews,
            meanTimeBeforeCreationDeclaration,
            meanTimeBeforeClosingDeclaration,
            numberOfReviewedComments,
            wau,
        },
    });
};
