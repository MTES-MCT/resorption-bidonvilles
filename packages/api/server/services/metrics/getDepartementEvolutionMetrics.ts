import { DepartementEvolutionMetricsRawData } from '#server/models/metricsModel/getDepartementEvolutionData';
import metricsModel from '#server/models/metricsModel';
import ServiceError from '#server/errors/ServiceError';
import getLivingConditionsStatuses from '#server/models/shantytownModel/_common/livingConditions/v2/statuses/main';
import { DepartementMetricsEvolution } from '#root/types/resources/DepartementMetricsEvolution.d';
import initializeListOfDates from './_utils/initializeListOfDates';
import getEvolution from './_utils/getEvolution';

import getReportIndex from '../dataReport/_utils/getReportIndex';
import getIndex from './_utils/getIndex';

export default async (user, departementCode, argFrom: Date, argTo: Date):Promise<DepartementMetricsEvolution> => {
    let data:DepartementEvolutionMetricsRawData[];
    try {
        data = await metricsModel.getDepartementEvolutionData(user, departementCode, argFrom, argTo);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const listOfDates = initializeListOfDates(argFrom, argTo);


    const metrics:DepartementMetricsEvolution = {
        summary: {
            towns: {
                figures: {
                    total: {
                        value: 0,
                        evolution: 0,
                    },
                    less_than_10: {
                        value: 0,
                        evolution: 0,
                    },
                    between_10_and_99: {
                        value: 0,
                        evolution: 0,
                    },
                    more_than_99: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDates.map(date => date.label),
                    total: Array(listOfDates.length).fill(0),
                    less_than_10: Array(listOfDates.length).fill(0),
                    between_10_and_99: Array(listOfDates.length).fill(0),
                    more_than_99: Array(listOfDates.length).fill(0),
                },
            },
            inhabitants: {
                figures: {
                    total: {
                        value: 0,
                        evolution: 0,
                    },
                    european: {
                        value: 0,
                        evolution: 0,
                    },
                    foreign: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDates.map(date => date.label),
                    total: Array(listOfDates.length).fill(0),
                    european: Array(listOfDates.length).fill(0),
                    foreign: Array(listOfDates.length).fill(0),
                },
            },
            water: {
                figures: {
                    towns_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_total: {
                        value: 0,
                        evolution: 0,
                    },
                    access_to_water: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDates.map(date => date.label),
                    inhabitants_total: Array(listOfDates.length).fill(0),
                    access_to_water: Array(listOfDates.length).fill(0),
                },
            },
        },
        inhabitants: {
            towns: {
                figures: {
                    total: {
                        value: 0,
                        evolution: 0,
                    },
                    less_than_10: {
                        value: 0,
                        evolution: 0,
                    },
                    between_10_and_99: {
                        value: 0,
                        evolution: 0,
                    },
                    more_than_99: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDates.map(date => date.label),
                    total: Array(listOfDates.length).fill(0),
                    less_than_10: Array(listOfDates.length).fill(0),
                    between_10_and_99: Array(listOfDates.length).fill(0),
                    more_than_99: Array(listOfDates.length).fill(0),
                },
            },
            inhabitants: {
                figures: {
                    total: {
                        value: 0,
                        evolution: 0,
                    },
                    european: {
                        value: 0,
                        evolution: 0,
                    },
                    foreign: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDates.map(date => date.label),
                    total: Array(listOfDates.length).fill(0),
                    european: Array(listOfDates.length).fill(0),
                    foreign: Array(listOfDates.length).fill(0),
                },
            },
        },
        livingConditions: {
            water: {
                figures: {
                    towns_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_with_access_to_water: {
                        value: 0,
                        evolution: 0,
                    },
                    towns_with_access_to_water: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDates.map(date => date.label),
                    inhabitants_total: Array(listOfDates.length).fill(0),
                    inhabitants_with_access_to_water: Array(listOfDates.length).fill(0),
                    towns_total: Array(listOfDates.length).fill(0),
                    towns_with_access_to_water: Array(listOfDates.length).fill(0),
                },
            },
            electricity: {
                figures: {
                    towns_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_with_access_to_electricity: {
                        value: 0,
                        evolution: 0,
                    },
                    towns_with_access_to_electricity: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDates.map(date => date.label),
                    inhabitants_total: Array(listOfDates.length).fill(0),
                    inhabitants_with_access_to_electricity: Array(listOfDates.length).fill(0),
                    towns_total: Array(listOfDates.length).fill(0),
                    towns_with_access_to_electricity: Array(listOfDates.length).fill(0),
                },
            },
            toilets: {
                figures: {
                    towns_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_with_access_to_toilets: {
                        value: 0,
                        evolution: 0,
                    },
                    towns_with_access_to_toilets: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDates.map(date => date.label),
                    inhabitants_total: Array(listOfDates.length).fill(0),
                    inhabitants_with_access_to_toilets: Array(listOfDates.length).fill(0),
                    towns_total: Array(listOfDates.length).fill(0),
                    towns_with_access_to_toilets: Array(listOfDates.length).fill(0),
                },
            },
            fire_prevention: {
                figures: {
                    towns_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_with_access_to_fire_prevention: {
                        value: 0,
                        evolution: 0,
                    },
                    towns_with_access_to_fire_prevention: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDates.map(date => date.label),
                    inhabitants_total: Array(listOfDates.length).fill(0),
                    inhabitants_with_access_to_fire_prevention: Array(listOfDates.length).fill(0),
                    towns_total: Array(listOfDates.length).fill(0),
                    towns_with_access_to_fire_prevention: Array(listOfDates.length).fill(0),
                },
            },
            trash_evacuation: {
                figures: {
                    towns_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_with_access_to_trash_evacuation: {
                        value: 0,
                        evolution: 0,
                    },
                    towns_with_access_to_trash_evacuation: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDates.map(date => date.label),
                    inhabitants_total: Array(listOfDates.length).fill(0),
                    inhabitants_with_access_to_trash_evacuation: Array(listOfDates.length).fill(0),
                    towns_total: Array(listOfDates.length).fill(0),
                    towns_with_access_to_trash_evacuation: Array(listOfDates.length).fill(0),
                },
            },
            pest_animals: {
                figures: {
                    towns_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_with_absence_of_pest_animals: {
                        value: 0,
                        evolution: 0,
                    },
                    towns_with_absence_of_pest_animals: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDates.map(date => date.label),
                    inhabitants_total: Array(listOfDates.length).fill(0),
                    inhabitants_with_absence_of_pest_animals: Array(listOfDates.length).fill(0),
                    towns_total: Array(listOfDates.length).fill(0),
                    towns_with_absence_of_pest_animals: Array(listOfDates.length).fill(0),
                },
            },
        },
        justice: {
            justice: {
                figures: {
                    police: {
                        value: 0,
                        evolution: 0,
                    },
                    complaints: {
                        value: 0,
                        evolution: 0,
                    },
                    closed_towns: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDates.map(date => date.label),
                    police: Array(listOfDates.length).fill(0),
                    complaints: Array(listOfDates.length).fill(0),
                    closed_towns: Array(listOfDates.length).fill(0),
                },
            },
        },
    };

    let previousIndex;
    data.forEach((row, index) => {
        const isLast = data[index + 1]?.shantytown_id !== row.shantytown_id;
        const isNew = index === 0 || row.shantytown_id !== data[index - 1].shantytown_id;
        const livingConditionsStatuses = getLivingConditionsStatuses(row);


        if (isNew) {
            previousIndex = undefined;
        }


        // on récupère l'index de la première date dans notre rapport concernée par la saisie
        // (le Math.max permet de gérer le cas où la date de saisie est < from, ie. un index négatif)
        const reportIndex = Math.max(
            0,
            getIndex(listOfDates.map(({ date }) => date), isLast ? row.known_since : row.input_date),
        );

        // on impacte les totaux des sites existants pour tous les rapports existants entre la date
        // de création du site et sa date de fermeture
        // on le fait séparément une fois ici car il s'agit de totaux qui ne dépendent pas des
        // saisies intermédiaires (contrairement au nombre de personnes)

        let maxReportIndex;
        if (previousIndex === undefined) {
            maxReportIndex = row.closed_at
                ? getReportIndex(argFrom, argTo, row.closed_at)
                : listOfDates.length;
        } else {
            maxReportIndex = previousIndex;
        }

        // on ignore les saisies intermédiaires entre deux dates
        // (par exemple si la date est "15/01/2023" mais qu'on a déjà traité "16/01/2023", on peut l'ignorer)
        if (previousIndex === reportIndex) {
            return;
        }

        for (let i = reportIndex; i < maxReportIndex; i += 1) {
            // on remplit les chiffres des sites et habitants
            metrics.summary.towns.charts.total[i] += 1;
            metrics.inhabitants.towns.charts.total[i] += 1;
            metrics.summary.inhabitants.charts.total[i] += row.population_total;
            metrics.inhabitants.inhabitants.charts.total[i] += row.population_total;
            metrics.summary.water.charts.inhabitants_total[i] += row.population_total;
            metrics.livingConditions.water.charts.inhabitants_total[i] += row.population_total;
            metrics.livingConditions.water.charts.towns_total[i] += 1;
            metrics.livingConditions.electricity.charts.inhabitants_total[i] += row.population_total;
            metrics.livingConditions.electricity.charts.towns_total[i] += 1;
            metrics.livingConditions.toilets.charts.inhabitants_total[i] += row.population_total;
            metrics.livingConditions.toilets.charts.towns_total[i] += 1;
            metrics.livingConditions.fire_prevention.charts.inhabitants_total[i] += row.population_total;
            metrics.livingConditions.fire_prevention.charts.towns_total[i] += 1;
            metrics.livingConditions.trash_evacuation.charts.inhabitants_total[i] += row.population_total;
            metrics.livingConditions.trash_evacuation.charts.towns_total[i] += 1;
            metrics.livingConditions.pest_animals.charts.inhabitants_total[i] += row.population_total;
            metrics.livingConditions.pest_animals.charts.towns_total[i] += 1;
            if (row.population_total < 10) {
                metrics.summary.towns.charts.less_than_10[i] += 1;
                metrics.inhabitants.towns.charts.less_than_10[i] += 1;
            }
            if (row.population_total >= 10 && row.population_total <= 99) {
                metrics.summary.towns.charts.between_10_and_99[i] += 1;
                metrics.inhabitants.towns.charts.between_10_and_99[i] += 1;
            }
            if (row.population_total >= 100) {
                metrics.summary.towns.charts.more_than_99[i] += 1;
                metrics.inhabitants.towns.charts.more_than_99[i] += 1;
            }
            if (row.origins.length === 1 && row.origins[0] === 'european') {
                metrics.summary.inhabitants.charts.european[i] += row.population_total;
                metrics.inhabitants.inhabitants.charts.european[i] += row.population_total;
            }
            if (row.origins.length === 1 && row.origins[0] === 'other') {
                metrics.summary.inhabitants.charts.foreign[i] += row.population_total;
                metrics.inhabitants.inhabitants.charts.foreign[i] += row.population_total;
            }

            // on remplit les chiffres des conditions de vie
            if (livingConditionsStatuses.water.status === 'good') {
                metrics.summary.water.charts.access_to_water[i] += row.population_total;
                metrics.livingConditions.water.charts.inhabitants_with_access_to_water[i] += row.population_total;
                metrics.livingConditions.water.charts.towns_with_access_to_water[i] += 1;
            }
            if (livingConditionsStatuses.electricity.status === 'good') {
                metrics.livingConditions.electricity.charts.inhabitants_with_access_to_electricity[i] += row.population_total;
                metrics.livingConditions.electricity.charts.towns_with_access_to_electricity[i] += 1;
            }
            if (livingConditionsStatuses.sanitary.status === 'good') {
                metrics.livingConditions.toilets.charts.inhabitants_with_access_to_toilets[i] += row.population_total;
                metrics.livingConditions.toilets.charts.towns_with_access_to_toilets[i] += 1;
            }
            if (livingConditionsStatuses.fire_prevention.status === 'good') {
                metrics.livingConditions.fire_prevention.charts.inhabitants_with_access_to_fire_prevention[i] += row.population_total;
                metrics.livingConditions.fire_prevention.charts.towns_with_access_to_fire_prevention[i] += 1;
            }
            if (livingConditionsStatuses.trash.status === 'good') {
                metrics.livingConditions.trash_evacuation.charts.inhabitants_with_access_to_trash_evacuation[i] += row.population_total;
                metrics.livingConditions.trash_evacuation.charts.towns_with_access_to_trash_evacuation[i] += 1;
            }
            if (livingConditionsStatuses.pest_animals.status === 'good') {
                metrics.livingConditions.pest_animals.charts.inhabitants_with_absence_of_pest_animals[i] += row.population_total;
                metrics.livingConditions.pest_animals.charts.towns_with_absence_of_pest_animals[i] += 1;
            }

            // on remplit les chiffres de la justice

            if (row.police_status === 'granted') {
                metrics.justice.justice.charts.police[i] += 1;
            }

            if (row.owner_complaint === true) {
                metrics.justice.justice.charts.complaints[i] += 1;
            }


            previousIndex = reportIndex;
        }
    });

    // on calcule les totaux et évolutions

    // pour la synthèse
    metrics.summary.towns.figures.total.value = metrics.summary.towns.charts.total[listOfDates.length - 1];
    metrics.summary.towns.figures.total.evolution = getEvolution(metrics.summary.towns.charts.total[listOfDates.length - 1] - metrics.summary.towns.charts.total[0], metrics.summary.towns.charts.total[0]);
    metrics.summary.towns.figures.less_than_10.value = metrics.summary.towns.charts.less_than_10[listOfDates.length - 1];
    metrics.summary.towns.figures.less_than_10.evolution = getEvolution(metrics.summary.towns.charts.less_than_10[listOfDates.length - 1] - metrics.summary.towns.charts.less_than_10[0], metrics.summary.towns.charts.less_than_10[0]);
    metrics.summary.towns.figures.between_10_and_99.value = metrics.summary.towns.charts.between_10_and_99[listOfDates.length - 1];
    metrics.summary.towns.figures.between_10_and_99.evolution = getEvolution(metrics.summary.towns.charts.between_10_and_99[listOfDates.length - 1] - metrics.summary.towns.charts.between_10_and_99[0], metrics.summary.towns.charts.between_10_and_99[listOfDates.length - 1]);
    metrics.summary.towns.figures.more_than_99.value = metrics.summary.towns.charts.more_than_99[listOfDates.length - 1];
    metrics.summary.towns.figures.more_than_99.evolution = getEvolution(metrics.summary.towns.charts.more_than_99[listOfDates.length - 1] - metrics.summary.towns.charts.more_than_99[0], metrics.summary.towns.charts.more_than_99[listOfDates.length - 1]);

    metrics.summary.inhabitants.figures.total.value = metrics.summary.inhabitants.charts.total[listOfDates.length - 1];
    metrics.summary.inhabitants.figures.total.evolution = getEvolution(metrics.summary.inhabitants.charts.total[listOfDates.length - 1] - metrics.summary.inhabitants.charts.total[0], metrics.summary.inhabitants.charts.total[listOfDates.length - 1]);
    metrics.summary.inhabitants.figures.european.value = metrics.summary.inhabitants.charts.european[listOfDates.length - 1];
    metrics.summary.inhabitants.figures.european.evolution = getEvolution(metrics.summary.inhabitants.charts.european[listOfDates.length - 1] - metrics.summary.inhabitants.charts.european[0], metrics.summary.inhabitants.charts.european[listOfDates.length - 1]);
    metrics.summary.inhabitants.figures.foreign.value = metrics.summary.inhabitants.charts.foreign[listOfDates.length - 1];
    metrics.summary.inhabitants.figures.foreign.evolution = getEvolution(metrics.summary.inhabitants.charts.foreign[listOfDates.length - 1] - metrics.summary.inhabitants.charts.foreign[0], metrics.summary.inhabitants.charts.foreign[listOfDates.length - 1]);

    metrics.summary.water.figures.towns_total.value = metrics.summary.water.charts.inhabitants_total[listOfDates.length - 1];
    metrics.summary.water.figures.towns_total.evolution = getEvolution(metrics.summary.water.charts.inhabitants_total[listOfDates.length - 1] - metrics.summary.water.charts.inhabitants_total[0], metrics.summary.water.charts.inhabitants_total[listOfDates.length - 1]);
    metrics.summary.water.figures.inhabitants_total.value = metrics.summary.water.charts.inhabitants_total[listOfDates.length - 1];
    metrics.summary.water.figures.inhabitants_total.evolution = getEvolution(metrics.summary.water.charts.inhabitants_total[listOfDates.length - 1] - metrics.summary.water.charts.inhabitants_total[0], metrics.summary.water.charts.inhabitants_total[listOfDates.length - 1]);
    metrics.summary.water.figures.access_to_water.value = metrics.summary.water.charts.access_to_water[listOfDates.length - 1];
    metrics.summary.water.figures.access_to_water.evolution = getEvolution(metrics.summary.water.charts.access_to_water[listOfDates.length - 1] - metrics.summary.water.charts.access_to_water[0], metrics.summary.water.charts.access_to_water[listOfDates.length - 1]);

    // pour les habitants
    metrics.inhabitants.towns.figures.total.value = metrics.inhabitants.towns.charts.total[listOfDates.length - 1];
    metrics.inhabitants.towns.figures.total.evolution = getEvolution(metrics.inhabitants.towns.charts.total[listOfDates.length - 1] - metrics.inhabitants.towns.charts.total[0], metrics.inhabitants.towns.charts.total[0]);
    metrics.inhabitants.towns.figures.less_than_10.value = metrics.inhabitants.towns.charts.less_than_10[listOfDates.length - 1];
    metrics.inhabitants.towns.figures.less_than_10.evolution = getEvolution(metrics.inhabitants.towns.charts.less_than_10[listOfDates.length - 1] - metrics.inhabitants.towns.charts.less_than_10[0], metrics.inhabitants.towns.charts.less_than_10[0]);
    metrics.inhabitants.towns.figures.between_10_and_99.value = metrics.inhabitants.towns.charts.between_10_and_99[listOfDates.length - 1];
    metrics.inhabitants.towns.figures.between_10_and_99.evolution = getEvolution(metrics.inhabitants.towns.charts.between_10_and_99[listOfDates.length - 1] - metrics.inhabitants.towns.charts.between_10_and_99[0], metrics.inhabitants.towns.charts.between_10_and_99[0]);
    metrics.inhabitants.towns.figures.more_than_99.value = metrics.inhabitants.towns.charts.more_than_99[listOfDates.length - 1];
    metrics.inhabitants.towns.figures.more_than_99.evolution = getEvolution(metrics.inhabitants.towns.charts.more_than_99[listOfDates.length - 1] - metrics.inhabitants.towns.charts.more_than_99[0], metrics.inhabitants.towns.charts.more_than_99[0]);

    metrics.inhabitants.inhabitants.figures.total.value = metrics.inhabitants.inhabitants.charts.total[listOfDates.length - 1];
    metrics.inhabitants.inhabitants.figures.total.evolution = getEvolution(metrics.inhabitants.inhabitants.charts.total[listOfDates.length - 1] - metrics.inhabitants.inhabitants.charts.total[0], metrics.inhabitants.inhabitants.charts.total[0]);
    metrics.inhabitants.inhabitants.figures.european.value = metrics.inhabitants.inhabitants.charts.european[listOfDates.length - 1];
    metrics.inhabitants.inhabitants.figures.european.evolution = getEvolution(metrics.inhabitants.inhabitants.charts.european[listOfDates.length - 1] - metrics.inhabitants.inhabitants.charts.european[0], metrics.inhabitants.inhabitants.charts.european[0]);
    metrics.inhabitants.inhabitants.figures.foreign.value = metrics.inhabitants.inhabitants.charts.foreign[listOfDates.length - 1];
    metrics.inhabitants.inhabitants.figures.foreign.evolution = getEvolution(metrics.inhabitants.inhabitants.charts.foreign[listOfDates.length - 1] - metrics.inhabitants.inhabitants.charts.foreign[0], metrics.inhabitants.inhabitants.charts.foreign[0]);

    // pour les conditions de vie
    metrics.livingConditions.water.figures.towns_total.value = metrics.summary.towns.figures.total.value;
    metrics.livingConditions.water.figures.towns_total.evolution = metrics.summary.towns.figures.total.evolution;
    metrics.livingConditions.water.figures.inhabitants_total.value = metrics.livingConditions.water.charts.inhabitants_total[listOfDates.length - 1];
    metrics.livingConditions.water.figures.inhabitants_total.evolution = getEvolution(metrics.livingConditions.water.charts.inhabitants_total[listOfDates.length - 1] - metrics.livingConditions.water.charts.inhabitants_total[0], metrics.livingConditions.water.charts.inhabitants_total[listOfDates.length - 1]);
    metrics.livingConditions.water.figures.inhabitants_with_access_to_water.value = metrics.livingConditions.water.charts.inhabitants_with_access_to_water[listOfDates.length - 1];
    metrics.livingConditions.water.figures.inhabitants_with_access_to_water.evolution = getEvolution(metrics.livingConditions.water.charts.inhabitants_with_access_to_water[listOfDates.length - 1] - metrics.livingConditions.water.charts.inhabitants_with_access_to_water[0], metrics.livingConditions.water.charts.inhabitants_with_access_to_water[listOfDates.length - 1]);
    metrics.livingConditions.water.figures.towns_with_access_to_water.value = metrics.livingConditions.water.charts.towns_with_access_to_water[listOfDates.length - 1];
    metrics.livingConditions.water.figures.towns_with_access_to_water.evolution = getEvolution(metrics.livingConditions.water.charts.towns_with_access_to_water[listOfDates.length - 1] - metrics.livingConditions.water.charts.towns_with_access_to_water[0], metrics.livingConditions.water.charts.towns_with_access_to_water[listOfDates.length - 1]);

    metrics.livingConditions.electricity.figures.towns_total.value = metrics.summary.towns.figures.total.value;
    metrics.livingConditions.electricity.figures.towns_total.evolution = metrics.summary.towns.figures.total.evolution;
    metrics.livingConditions.electricity.figures.inhabitants_total.value = metrics.livingConditions.electricity.charts.inhabitants_total[listOfDates.length - 1];
    metrics.livingConditions.electricity.figures.inhabitants_total.evolution = getEvolution(metrics.livingConditions.electricity.charts.inhabitants_total[listOfDates.length - 1] - metrics.livingConditions.electricity.charts.inhabitants_total[0], metrics.livingConditions.electricity.charts.inhabitants_total[listOfDates.length - 1]);
    metrics.livingConditions.electricity.figures.inhabitants_with_access_to_electricity.value = metrics.livingConditions.electricity.charts.inhabitants_with_access_to_electricity[listOfDates.length - 1];
    metrics.livingConditions.electricity.figures.inhabitants_with_access_to_electricity.evolution = getEvolution(metrics.livingConditions.electricity.charts.inhabitants_with_access_to_electricity[listOfDates.length - 1] - metrics.livingConditions.electricity.charts.inhabitants_with_access_to_electricity[0], metrics.livingConditions.electricity.charts.inhabitants_with_access_to_electricity[listOfDates.length - 1]);
    metrics.livingConditions.electricity.figures.towns_with_access_to_electricity.value = metrics.livingConditions.electricity.charts.towns_with_access_to_electricity[listOfDates.length - 1];
    metrics.livingConditions.electricity.figures.towns_with_access_to_electricity.evolution = getEvolution(metrics.livingConditions.electricity.charts.towns_with_access_to_electricity[listOfDates.length - 1] - metrics.livingConditions.electricity.charts.towns_with_access_to_electricity[0], metrics.livingConditions.electricity.charts.towns_with_access_to_electricity[listOfDates.length - 1]);

    metrics.livingConditions.toilets.figures.towns_total.value = metrics.summary.towns.figures.total.value;
    metrics.livingConditions.toilets.figures.towns_total.evolution = metrics.summary.towns.figures.total.evolution;
    metrics.livingConditions.toilets.figures.inhabitants_total.value = metrics.livingConditions.toilets.charts.inhabitants_total[listOfDates.length - 1];
    metrics.livingConditions.toilets.figures.inhabitants_total.evolution = getEvolution(metrics.livingConditions.toilets.charts.inhabitants_total[listOfDates.length - 1] - metrics.livingConditions.toilets.charts.inhabitants_total[0], metrics.livingConditions.toilets.charts.inhabitants_total[listOfDates.length - 1]);
    metrics.livingConditions.toilets.figures.inhabitants_with_access_to_toilets.value = metrics.livingConditions.toilets.charts.inhabitants_with_access_to_toilets[listOfDates.length - 1];
    metrics.livingConditions.toilets.figures.inhabitants_with_access_to_toilets.evolution = getEvolution(metrics.livingConditions.toilets.charts.inhabitants_with_access_to_toilets[listOfDates.length - 1] - metrics.livingConditions.toilets.charts.inhabitants_with_access_to_toilets[0], metrics.livingConditions.toilets.charts.inhabitants_with_access_to_toilets[listOfDates.length - 1]);
    metrics.livingConditions.toilets.figures.towns_with_access_to_toilets.value = metrics.livingConditions.toilets.charts.towns_with_access_to_toilets[listOfDates.length - 1];
    metrics.livingConditions.toilets.figures.towns_with_access_to_toilets.evolution = getEvolution(metrics.livingConditions.toilets.charts.towns_with_access_to_toilets[listOfDates.length - 1] - metrics.livingConditions.toilets.charts.towns_with_access_to_toilets[0], metrics.livingConditions.toilets.charts.towns_with_access_to_toilets[listOfDates.length - 1]);

    metrics.livingConditions.fire_prevention.figures.towns_total.value = metrics.summary.towns.figures.total.value;
    metrics.livingConditions.fire_prevention.figures.towns_total.evolution = metrics.summary.towns.figures.total.evolution;
    metrics.livingConditions.fire_prevention.figures.inhabitants_total.value = metrics.livingConditions.fire_prevention.charts.inhabitants_total[listOfDates.length - 1];
    metrics.livingConditions.fire_prevention.figures.inhabitants_total.evolution = getEvolution(metrics.livingConditions.fire_prevention.charts.inhabitants_total[listOfDates.length - 1] - metrics.livingConditions.fire_prevention.charts.inhabitants_total[0], metrics.livingConditions.fire_prevention.charts.inhabitants_total[listOfDates.length - 1]);
    metrics.livingConditions.fire_prevention.figures.inhabitants_with_access_to_fire_prevention.value = metrics.livingConditions.fire_prevention.charts.inhabitants_with_access_to_fire_prevention[listOfDates.length - 1];
    metrics.livingConditions.fire_prevention.figures.inhabitants_with_access_to_fire_prevention.evolution = getEvolution(metrics.livingConditions.fire_prevention.charts.inhabitants_with_access_to_fire_prevention[listOfDates.length - 1] - metrics.livingConditions.fire_prevention.charts.inhabitants_with_access_to_fire_prevention[0], metrics.livingConditions.fire_prevention.charts.inhabitants_with_access_to_fire_prevention[listOfDates.length - 1]);
    metrics.livingConditions.fire_prevention.figures.towns_with_access_to_fire_prevention.value = metrics.livingConditions.fire_prevention.charts.towns_with_access_to_fire_prevention[listOfDates.length - 1];
    metrics.livingConditions.fire_prevention.figures.towns_with_access_to_fire_prevention.evolution = getEvolution(metrics.livingConditions.fire_prevention.charts.towns_with_access_to_fire_prevention[listOfDates.length - 1] - metrics.livingConditions.fire_prevention.charts.towns_with_access_to_fire_prevention[0], metrics.livingConditions.fire_prevention.charts.towns_with_access_to_fire_prevention[listOfDates.length - 1]);

    metrics.livingConditions.trash_evacuation.figures.towns_total.value = metrics.summary.towns.figures.total.value;
    metrics.livingConditions.trash_evacuation.figures.towns_total.evolution = metrics.summary.towns.figures.total.evolution;
    metrics.livingConditions.trash_evacuation.figures.inhabitants_total.value = metrics.livingConditions.trash_evacuation.charts.inhabitants_total[listOfDates.length - 1];
    metrics.livingConditions.trash_evacuation.figures.inhabitants_total.evolution = getEvolution(metrics.livingConditions.trash_evacuation.charts.inhabitants_total[listOfDates.length - 1] - metrics.livingConditions.trash_evacuation.charts.inhabitants_total[0], metrics.livingConditions.trash_evacuation.charts.inhabitants_total[listOfDates.length - 1]);
    metrics.livingConditions.trash_evacuation.figures.inhabitants_with_access_to_trash_evacuation.value = metrics.livingConditions.trash_evacuation.charts.inhabitants_with_access_to_trash_evacuation[listOfDates.length - 1];
    metrics.livingConditions.trash_evacuation.figures.inhabitants_with_access_to_trash_evacuation.evolution = getEvolution(metrics.livingConditions.trash_evacuation.charts.inhabitants_with_access_to_trash_evacuation[listOfDates.length - 1] - metrics.livingConditions.trash_evacuation.charts.inhabitants_with_access_to_trash_evacuation[0], metrics.livingConditions.trash_evacuation.charts.inhabitants_with_access_to_trash_evacuation[listOfDates.length - 1]);
    metrics.livingConditions.trash_evacuation.figures.towns_with_access_to_trash_evacuation.value = metrics.livingConditions.trash_evacuation.charts.towns_with_access_to_trash_evacuation[listOfDates.length - 1];
    metrics.livingConditions.trash_evacuation.figures.towns_with_access_to_trash_evacuation.evolution = getEvolution(metrics.livingConditions.trash_evacuation.charts.towns_with_access_to_trash_evacuation[listOfDates.length - 1] - metrics.livingConditions.trash_evacuation.charts.towns_with_access_to_trash_evacuation[0], metrics.livingConditions.trash_evacuation.charts.towns_with_access_to_trash_evacuation[listOfDates.length - 1]);

    metrics.livingConditions.pest_animals.figures.towns_total.value = metrics.summary.towns.figures.total.value;
    metrics.livingConditions.pest_animals.figures.towns_total.evolution = metrics.summary.towns.figures.total.evolution;
    metrics.livingConditions.pest_animals.figures.inhabitants_total.value = metrics.livingConditions.pest_animals.charts.inhabitants_total[listOfDates.length - 1];
    metrics.livingConditions.pest_animals.figures.inhabitants_total.evolution = getEvolution(metrics.livingConditions.pest_animals.charts.inhabitants_total[listOfDates.length - 1] - metrics.livingConditions.pest_animals.charts.inhabitants_total[0], metrics.livingConditions.pest_animals.charts.inhabitants_total[listOfDates.length - 1]);
    metrics.livingConditions.pest_animals.figures.inhabitants_with_absence_of_pest_animals.value = metrics.livingConditions.pest_animals.charts.inhabitants_with_absence_of_pest_animals[listOfDates.length - 1];
    metrics.livingConditions.pest_animals.figures.inhabitants_with_absence_of_pest_animals.evolution = getEvolution(metrics.livingConditions.pest_animals.charts.inhabitants_with_absence_of_pest_animals[listOfDates.length - 1] - metrics.livingConditions.pest_animals.charts.inhabitants_with_absence_of_pest_animals[0], metrics.livingConditions.pest_animals.charts.inhabitants_with_absence_of_pest_animals[listOfDates.length - 1]);
    metrics.livingConditions.pest_animals.figures.towns_with_absence_of_pest_animals.value = metrics.livingConditions.pest_animals.charts.towns_with_absence_of_pest_animals[listOfDates.length - 1];
    metrics.livingConditions.pest_animals.figures.towns_with_absence_of_pest_animals.evolution = getEvolution(metrics.livingConditions.pest_animals.charts.towns_with_absence_of_pest_animals[listOfDates.length - 1] - metrics.livingConditions.pest_animals.charts.towns_with_absence_of_pest_animals[0], metrics.livingConditions.pest_animals.charts.towns_with_absence_of_pest_animals[listOfDates.length - 1]);

    // pour la justice
    metrics.justice.justice.figures.police.value = metrics.justice.justice.charts.police[listOfDates.length - 1];
    metrics.justice.justice.figures.police.evolution = getEvolution(metrics.justice.justice.charts.police[listOfDates.length - 1] - metrics.justice.justice.charts.police[0], metrics.justice.justice.charts.police[listOfDates.length - 1]);
    metrics.justice.justice.figures.complaints.value = metrics.justice.justice.charts.complaints[listOfDates.length - 1];
    metrics.justice.justice.figures.complaints.evolution = getEvolution(metrics.justice.justice.charts.complaints[listOfDates.length - 1] - metrics.justice.justice.charts.complaints[0], metrics.justice.justice.charts.complaints[listOfDates.length - 1]);
    return metrics;
};
