const moment = require('moment');

module.exports = (towns, users, listOfDates) => {
    const userStats = {
        evolution: 0,
        figures: [],
    };
    const population = {
        evolution: 0,
        figures: [],
    };
    const minors = {
        evolution: 0,
        figures: [],
    };
    const minorsInSchool = {
        evolution: 0,
        figures: [],
    };
    const openShantytowns = {
        evolution: 0,
        figures: [],
    };
    const closedShantytowns = {
        evolution: 0,
        figures: [],
    };
    const resorbedShantytowns = {
        evolution: 0,
        figures: [],
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
            let usersTotal = 0;
            towns.forEach(
                (town) => {
                    if (!listOfId.includes(town.id) && moment(town.updated_at).format('YYYY-MM-DD HH:mm:ss ZZ') <= date) {
                        listOfId.push(town.id);
                        if (town.closed_at === null) {
                            populationTotal += town.population;
                            minorsTotal += town.minors;
                            minorsInSchoolTotal += town.minors_in_school;
                            openShantytownsTotal += 1;
                        } else {
                            closedShantytownsTotal += 1;
                            resorbedShantytownsTotal += town.resorbed === 'yes' ? 1 : 0;
                        }
                    }
                },
            );
            users.forEach(
                (user) => {
                    if (moment(user.created_at).format('YYYY-MM-DD HH:mm:ss ZZ') <= date) {
                        usersTotal += 1;
                    }
                },
            );
            population.figures.push(populationTotal);
            minors.figures.push(minorsTotal);
            minorsInSchool.figures.push(minorsInSchoolTotal);
            closedShantytowns.figures.push(closedShantytownsTotal);
            resorbedShantytowns.figures.push(resorbedShantytownsTotal);
            openShantytowns.figures.push(openShantytownsTotal);
            userStats.figures.push(usersTotal);
        },
    );
    population.evolution = Math.round((((population.figures[0] - population.figures.slice(-1)[0]) * 100) / population.figures[0]).toFixed(2));
    minors.evolution = Math.round((((minors.figures[0] - minors.figures.slice(-1)[0]) * 100) / minors.figures[0]).toFixed(2));
    closedShantytowns.evolution = Math.round((((closedShantytowns.figures[0] - closedShantytowns.figures.slice(-1)[0]) * 100) / closedShantytowns.figures[0]).toFixed(2));
    resorbedShantytowns.evolution = Math.round((((resorbedShantytowns.figures[0] - resorbedShantytowns.figures.slice(-1)[0]) * 100) / resorbedShantytowns.figures[0]).toFixed(2));
    userStats.evolution = Math.round((((userStats.figures[0] - userStats.figures.slice(-1)[0]) * 100) / userStats.figures[0]).toFixed(2));
    return {
        population, minors, closedShantytowns, resorbedShantytowns, userStats, openShantytowns, minorsInSchool,
    };
};
