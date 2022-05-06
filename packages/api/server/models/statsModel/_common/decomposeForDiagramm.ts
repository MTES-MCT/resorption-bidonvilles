import moment from 'moment';

export default (towns, users, listOfDates, location) => {
    const date2019 = moment(new Date('2019-01-01T00:00:00')).format('YYYY-MM-DD HH:mm:ss ZZ');

    type Stats = {
        evolution: number,
        figures: number[]
    };

    const userStats: Stats = {
        evolution: 0,
        figures: [],
    };
    const population: Stats = {
        evolution: 0,
        figures: [],
    };
    const minors: Stats = {
        evolution: 0,
        figures: [],
    };
    const minorsInSchool: Stats = {
        evolution: 0,
        figures: [],
    };
    const openShantytowns: Stats = {
        evolution: 0,
        figures: [],
    };
    const closedShantytowns: Stats = {
        evolution: 0,
        figures: [],
    };
    const resorbedShantytowns: Stats = {
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
                        if (location.type === 'nation' || town.code === location[location.type].code) {
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
            population.figures.unshift(populationTotal);
            minors.figures.unshift(minorsTotal);
            minorsInSchool.figures.unshift(minorsInSchoolTotal);
            closedShantytowns.figures.unshift(closedShantytownsTotal);
            resorbedShantytowns.figures.unshift(resorbedShantytownsTotal);
            openShantytowns.figures.unshift(openShantytownsTotal);
            userStats.figures.unshift(usersTotal);
        },
    );
    population.evolution = Math.round((((population.figures.slice(-1)[0] - population.figures[0]) * 100) / population.figures[0]));
    minors.evolution = Math.round((((minors.figures.slice(-1)[0] - minors.figures[0]) * 100) / minors.figures[0]));
    closedShantytowns.evolution = Math.round((((closedShantytowns.figures.slice(-1)[0] - closedShantytowns.figures[0]) * 100) / closedShantytowns.figures[0]));
    resorbedShantytowns.evolution = Math.round((((resorbedShantytowns.figures.slice(-1)[0] - resorbedShantytowns.figures[0]) * 100) / resorbedShantytowns.figures[0]));
    userStats.evolution = Math.round((((userStats.figures.slice(-1)[0] - userStats.figures[0]) * 100) / userStats.figures[0]));
    return {
        population, minors, closedShantytowns, resorbedShantytowns, userStats, openShantytowns, minorsInSchool,
    };
};
