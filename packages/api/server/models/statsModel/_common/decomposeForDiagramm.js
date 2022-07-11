const moment = require('moment');

module.exports = (towns, connectedUsers, listOfDates) => {
    const date2019 = moment(new Date('2019-01-01T00:00:00')).format('YYYY-MM-DD HH:mm:ss ZZ');

    const connectedUserStats = {
        evolution: 0,
        data: connectedUsers.reverse().map(connectedUser => ({
            figure: connectedUser.count,
            formatedDateFrom: connectedUser.date_debut,
            formatedDate: connectedUser.date_fin,
        })),
    };
    const population = {
        evolution: 0,
        data: [],
    };
    const minors = {
        evolution: 0,
        data: [],
    };
    const minorsInSchool = {
        evolution: 0,
        data: [],
    };
    const openShantytowns = {
        evolution: 0,
        data: [],
    };
    const closedShantytowns = {
        evolution: 0,
        data: [],
    };
    const resorbedShantytowns = {
        evolution: 0,
        data: [],
    };

    listOfDates.forEach(
        (date) => {
            const listOfId = [];
            let populationTotal = 0;
            let minorsTotal = 0;
            let minorsInSchoolTotal = 0;
            let openShantytownsTotal = 0;
            let closedShantytownsTotal = 0;
            let resorbedShantytownsTotal = 0;

            towns.forEach(
                (town) => {
                    if (!listOfId.includes(town.id) && moment(town.updated_at).format('YYYY-MM-DD HH:mm:ss ZZ') <= date) {
                        listOfId.push(town.id);

                        if (town.closed_at === null) {
                            populationTotal += town.population;
                            minorsTotal += town.minors;
                            minorsInSchoolTotal += town.minors_in_school;
                            openShantytownsTotal += 1;
                        } else if (town.resorbed === 'yes' && moment(town.closed_at).format('YYYY-MM-DD HH:mm:ss ZZ') >= date2019) {
                            resorbedShantytownsTotal += 1;
                        } else if (moment(town.closed_at).format('YYYY-MM-DD HH:mm:ss ZZ') > date2019) {
                            closedShantytownsTotal += 1;
                        }
                    }
                },
            );
            const formatedDate = moment(date).format('DD/MM');
            population.data.unshift({ figure: populationTotal, formatedDate });
            minors.data.unshift({ figure: minorsTotal, formatedDate });
            minorsInSchool.data.unshift({ figure: minorsInSchoolTotal, formatedDate });
            closedShantytowns.data.unshift({ figure: closedShantytownsTotal, formatedDate });
            resorbedShantytowns.data.unshift({ figure: resorbedShantytownsTotal, formatedDate });
            openShantytowns.data.unshift({ figure: openShantytownsTotal, formatedDate });
        },
    );

    population.evolution = Math.round((((population.data.slice(-1)[0].figure - population.data[0].figure) * 100) / population.data[0].figure).toFixed(2));
    minors.evolution = Math.round((((minors.data.slice(-1)[0].figure - minors.data[0].figure) * 100) / minors.data[0].figure).toFixed(2));
    closedShantytowns.evolution = Math.round((((closedShantytowns.data.slice(-1)[0].figure - closedShantytowns.data[0].figure) * 100) / closedShantytowns.data[0].figure).toFixed(2));
    resorbedShantytowns.evolution = Math.round((((resorbedShantytowns.data.slice(-1)[0].figure - resorbedShantytowns.data[0].figure) * 100) / resorbedShantytowns.data[0].figure).toFixed(2));
    connectedUserStats.evolution = Math.round((((connectedUserStats.data.slice(-1)[0].figure - connectedUserStats.data[0].figure) * 100) / connectedUserStats.data[0].figure).toFixed(2));

    return {
        population, minors, closedShantytowns, resorbedShantytowns, connectedUserStats, openShantytowns, minorsInSchool,
    };
};
