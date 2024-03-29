import moment from 'moment';

export default (towns, connectedUsers, listOfDates) => {
    const date2019 = new Date('2019-01-01T00:00:00');
    // connectedUsers ne contient pas les semaines sans utilisateur connecté, on les remplit donc ici
    const filledConnectedUsers = [];
    let index = 0;
    for (let compteur = 0; compteur < connectedUsers.length; compteur += 1) {
        if (connectedUsers[index].week === compteur) {
            filledConnectedUsers.push(connectedUsers[index]);
            index += 1;
        } else {
            const begginingOfWeek = new Date();
            const endOfWeek = new Date();
            begginingOfWeek.setDate(begginingOfWeek.getDate() - 7 * (compteur + 1));
            endOfWeek.setDate(endOfWeek.getDate() - 1 - 7 * compteur);
            filledConnectedUsers.push({
                count: '0',
                week: compteur,
                date_debut: moment(begginingOfWeek).format('DD/MM'),
                date_fin: moment(endOfWeek).format('DD/MM'),
            });
        }
    }

    const connectedUserStats = {
        evolution: 0,
        data: filledConnectedUsers.reverse().map(connectedUser => ({
            figure: connectedUser.count,
            formatedDateFrom: connectedUser.date_debut,
            formatedDate: connectedUser.date_fin,
        })),
    };
    const population: any = {
        evolution: 0,
        data: [],
    };
    const minors: any = {
        evolution: 0,
        data: [],
    };
    const minorsInSchool: any = {
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
            const listOfId = {};
            let populationTotal = 0;
            let minorsTotal = 0;
            let minorsInSchoolTotal = 0;
            let openShantytownsTotal = 0;
            let closedShantytownsTotal = 0;
            let resorbedShantytownsTotal = 0;

            towns.forEach(
                (town) => {
                    if (!listOfId[town.id] && town.updated_at <= date) {
                        listOfId[town.id] = true;
                        if (town.closed_at === null) {
                            populationTotal += town.population;
                            minorsTotal += town.minors;
                            minorsInSchoolTotal += town.minors_in_school;
                            openShantytownsTotal += 1;
                        } else if (town.resorbed === 'yes' && town.closed_at >= date2019) {
                            resorbedShantytownsTotal += 1;
                        } else if (town.closed_at > date2019) {
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

    population.evolution = Math.round(parseFloat((((population.data.slice(-1)[0].figure - population.data[0].figure) * 100) / population.data[0].figure).toFixed(2)));
    minors.evolution = Math.round(parseFloat((((minors.data.slice(-1)[0].figure - minors.data[0].figure) * 100) / minors.data[0].figure).toFixed(2)));
    closedShantytowns.evolution = Math.round(parseFloat((((closedShantytowns.data.slice(-1)[0].figure - closedShantytowns.data[0].figure) * 100) / closedShantytowns.data[0].figure).toFixed(2)));
    resorbedShantytowns.evolution = Math.round(parseFloat((((resorbedShantytowns.data.slice(-1)[0].figure - resorbedShantytowns.data[0].figure) * 100) / resorbedShantytowns.data[0].figure).toFixed(2)));
    connectedUserStats.evolution = connectedUserStats.data.length > 0 ? Math.round(
        parseFloat(
            (
                ((connectedUserStats.data.slice(-1)[0].figure - connectedUserStats.data[0].figure) * 100) / connectedUserStats.data[0].figure
            ).toFixed(2),
        ),
    ) : 0;

    return {
        population, minors, closedShantytowns, resorbedShantytowns, connectedUserStats, openShantytowns, minorsInSchool,
    };
};
