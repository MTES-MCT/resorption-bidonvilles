// const request = require('request-promise');
const fetch = require('node-fetch');

module.exports = () => ({
    // For test purpose, this method returns the number of weekly active user for the last week of december 2021
    async getWeeklyActiveUsers(req, res) {
        const getLastSunday = (d) => {
            const t = new Date(d);
            t.setDate(t.getDate() - t.getDay());
            return t;
        };

        const getDate = (d, delta) => {
            const t = new Date(d);
            t.setDate(t.getDate() - delta);
            return t;
        };

        const fetchStatsData = async (date) => {
            const segment = `segment=customVariableValue1==false,customVariableValue1=@${encodeURIComponent(
                'superuser:false',
            )}`;

            const MATOMO_AUTH_TOKEN = process.env.VUE_APP_MATOMO_AUTH_TOKEN;

            const url = `https://stats.data.gouv.fr/index.php?module=API&method=VisitsSummary.getUniqueVisitors&idSite=86&period=week&date=${date}&format=JSON&${segment}&token_auth=${MATOMO_AUTH_TOKEN}`;
            const response = await fetch(url);

            const result = await response.json();
            return result.value;
        };


        const lastSunday = getLastSunday(new Date());

        // Build an array of dates from the last 2 months : ["2021-01-03", "2021-01-10", ...]
        const last2MonthsWeeklyDates = Array.from(
            Array(10),
            (_, i) => i * 7,
        )
            .reverse()
            .map(delta => getDate(lastSunday, delta)
                .toISOString()
                .slice(0, 10));

        const data = await Promise.all(
            last2MonthsWeeklyDates.map(fetchStatsData),
        );

        this.matomoStats = {
            labels: last2MonthsWeeklyDates,
            datasets: [
                {
                    backgroundColor: ['#E5E5F4'],
                    data,
                    label: "Nombre d'utilisateurs par semaine",
                },
            ],
        };

        return res.status(200).send(this.matomoStats);
        /*
        const statisticAtDate = '2021-12-31';
        const MATOMO_AUTH_TOKEN = process.env.VUE_APP_MATOMO_AUTH_TOKEN;
        const BASE_URL = `https://stats.data.gouv.fr/index.php?module=API&method=VisitsSummary.getUniqueVisitors&idSite=86&period=month&date=${statisticAtDate}&format=JSON&token_auth=${MATOMO_AUTH_TOKEN}`;

        try {
            const response = await fetch(BASE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: MATOMO_AUTH_TOKEN,
                },
            });
            const json = await response.json();
            return res.status(200).send(json);
        } catch (error) {
            res.status(500).send({ user_message: 'Une erreur est survenue lors de l\'exécution de la requête' });
            return next(error);
        }
        */
    },
});
