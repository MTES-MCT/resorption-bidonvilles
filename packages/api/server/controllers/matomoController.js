const request = require('request-promise');

module.exports = () => ({
    // For test purpose, this method returns the number of weekly active user for the last week of december 2021
    async test(req, res, next) {
        const statisticAtDate = '2021-12-31';
        const MATOMO_AUTH_TOKEN = 'ac8317623ab44fb0aee280c5fc06e697';
        const BASE_URL = `https://stats.data.gouv.fr/index.php?module=API&method=VisitsSummary.getUniqueVisitors&idSite=86&period=month&date=${statisticAtDate}&format=JSON&token_auth=${MATOMO_AUTH_TOKEN}`;

        try {
            const returnValue = await request(BASE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                json: true,
            });
            return res.status(200).send(returnValue);
        } catch (error) {
            res.status(500).send({ user_message: 'Une erreur est survenue lors de l\'exécution de la requête' });
            return next(error);
        }
    },
});
