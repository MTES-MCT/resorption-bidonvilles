import statsModelFactory from '#server/models/statsModel';

const statsModel = statsModelFactory();

export default async (req, res) => {
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
        wau,
    ] = await Promise.all([
        statsModel.numberOfPeople(departement),
        statsModel.numberOfShantytown(departement),
        statsModel.numberOfResorbedShantytown(departement),
        statsModel.numberOfPlans(departement),
        statsModel.numberOfUsers(departement),
        statsModel.numberOfClosedShantytownsPerMonth(departement),
        statsModel.numberOfNewShantytownsPerMonth(departement),
        statsModel.numberOfResorbedShantytownsPerMonth(departement),
        statsModel.numberOfCreditsPerYear(departement),
        statsModel.averageCompletionPercentage(departement),
        statsModel.numberOfOpenShantytownsAtMonth(departement, '2019-06-01'),
        statsModel.populationTotal(departement),
        statsModel.wau(),
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
                wau,
            },
        },
    });
};
