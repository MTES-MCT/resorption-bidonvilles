const nodeFetch = require('node-fetch');
const { matomo } = require('#server/config');

module.exports = async (req, res) => {
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

        const url = `https://stats.data.gouv.fr/index.php?module=API&method=VisitsSummary.getUniqueVisitors&idSite=86&period=week&date=${encodeURIComponent(date)}&format=JSON&${segment}&token_auth=${encodeURIComponent(matomo.token)}`;
        const response = await nodeFetch(url);

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
};
