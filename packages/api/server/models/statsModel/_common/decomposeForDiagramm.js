const moment = require('moment');

module.exports = (towns, newUsers, listOfDates) => {
    const statsNewUsers = {
        label: 'nouveaux utilisateurs',
        evolution: 0,
        figures: [],
    };
    const population = {
        label: null,
        evolution: 0,
        figures: [],
    };
    const minors = {
        label: null,
        evolution: 0,
        figures: [],
    };
    const minors_in_school = {
        label: null,
        evolution: 0,
        figures: [],
    };
    const openShantytowns = {
        label: '',
        evolution: 0,
        figures: [],
    };
    const closedShantytowns = {
        label: 'sites fermés',
        evolution: 0,
        figures: [],
    };
    const resorbedShantytowns = {
        label: 'sites résorbés',
        evolution: 0,
        figures: [],
    };

    listOfDates.forEach(
        (date, index) => {
            const listOfId = [];
            let populationTotal = 0;
            let minorsTotal = 0;
            let minors_in_schoolTotal = 0;
            let openShantytownsTotal = 0;
            let closedShantytownsTotal = 0;
            let resorbedShantytownsTotal = 0;
            let newUsersTotal = 0;
            towns.forEach(
                (town) => {
                    if (!listOfId.includes(town.id) && moment(town.updated_at).format('YYYY-MM-DD HH:mm:ss ZZ') <= date) {
                        listOfId.push(town.id);
                        if (town.closed_at === null) {
                            populationTotal += town.population;
                            minorsTotal += town.minors;
                            minors_in_schoolTotal += town.minors_in_school;
                            openShantytownsTotal += 1;
                        } else {
                            closedShantytownsTotal += 1;
                            resorbedShantytownsTotal += town.resorbed === 'yes' ? 1 : 0;
                        }
                    }
                },
            );
            newUsers.forEach(
                (user) => {
                    if (moment(user.used_at).format('YYYY-MM-DD HH:mm:ss ZZ') <= date && moment(user.used_at).format('YYYY-MM-DD HH:mm:ss ZZ') > listOfDates[index + 1]) {
                        newUsersTotal += 1;
                    }
                },
            );
            population.figures.push(populationTotal);
            minors.figures.push(minorsTotal);
            minors_in_school.figures.push(minors_in_schoolTotal);
            closedShantytowns.figures.push(closedShantytownsTotal);
            resorbedShantytowns.figures.push(resorbedShantytownsTotal);
            openShantytowns.figures.push(openShantytownsTotal);
            statsNewUsers.figures.push(newUsersTotal);
        },
    );
    population.label = `personnes sur ${openShantytowns.figures[0]} sites`;
    population.evolution = Math.round((((population.figures[0] - population.figures[1]) * 100) / population.figures[0]).toFixed(2));
    minors.label = `enfants dont ${minors_in_school.figures[0]} scolarisés`;
    minors.evolution = Math.round((((minors.figures[0] - minors.figures[1]) * 100) / minors.figures[0]).toFixed(2));
    closedShantytowns.evolution = Math.round((((closedShantytowns.figures[0] - closedShantytowns.figures[1]) * 100) / closedShantytowns.figures[0]).toFixed(2));
    resorbedShantytowns.evolution = Math.round((((resorbedShantytowns.figures[0] - resorbedShantytowns.figures[1]) * 100) / resorbedShantytowns.figures[0]).toFixed(2));
    statsNewUsers.evolution = Math.round((((statsNewUsers.figures[0] - statsNewUsers.figures[1]) * 100) / statsNewUsers.figures[0]).toFixed(2));
    return [population, minors, closedShantytowns, resorbedShantytowns, statsNewUsers];
};
