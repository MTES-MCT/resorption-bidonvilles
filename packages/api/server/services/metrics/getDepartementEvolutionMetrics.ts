import permissionUtils from '#server/utils/permission';
import { DepartementEvolutionMetricsRawData } from '#server/models/metricsModel/getDepartementEvolutionData';
import metricsModel from '#server/models/metricsModel';
import ServiceError from '#server/errors/ServiceError';
import getLivingConditionsStatuses from '#server/models/shantytownModel/_common/livingConditions/v2/statuses/main';
import { Departement } from '#server/models/geoModel/Location.d';
import { DepartementMetricsEvolution } from '#root/types/resources/DepartementMetricsEvolution.d';
import { User } from '#root/types/resources/User.d';
import initializeListOfDates from './_utils/initializeListOfDates';
import initializeDepartementEvolutionMetrics from './_utils/initializeDepartementEvolutionMetrics';
import getEvolution from './_utils/getEvolution';

import getIndex from './_utils/getIndex';

const livingConditionsKeys = ['water', 'electricity', 'toilets', 'fire_prevention', 'trash_evacuation', 'pest_animals'];

export default async (user: User, departementCode: string, argFrom: Date, argTo: Date):Promise<DepartementMetricsEvolution> => {
    const hasJusticePermission = permissionUtils.can(user).do('access', 'shantytown_justice').on({ type: 'departement', departement: { code: departementCode } } as Departement);
    let data:DepartementEvolutionMetricsRawData[];
    try {
        data = await metricsModel.getDepartementEvolutionData(user, departementCode, argFrom, argTo);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const listOfDates = initializeListOfDates(argFrom, argTo);


    const metrics:DepartementMetricsEvolution = initializeDepartementEvolutionMetrics(listOfDates.map(({ label }) => label));

    let previousIndex;

    data.forEach((row, index) => {
        const isLast = data[index + 1]?.shantytown_id !== row.shantytown_id;
        const isNew = index === 0 || row.shantytown_id !== data[index - 1].shantytown_id;
        const livingConditionsStatuses = getLivingConditionsStatuses(row);


        if (isNew) {
            previousIndex = undefined;
        }

        const reportIndex = getIndex(listOfDates.map(({ date }) => date), isLast ? row.known_since : row.input_date);


        // on impacte les totaux des sites existants pour tous les rapports existants entre la date
        // de création du site et sa date de fermeture
        // on le fait séparément une fois ici car il s'agit de totaux qui ne dépendent pas des
        // saisies intermédiaires (contrairement au nombre de personnes)

        let maxReportIndex;
        if (previousIndex === undefined) {
            maxReportIndex = row.closed_at
                ? getIndex(listOfDates.map(({ date }) => date), row.closed_at)
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
            metrics.inhabitants.towns.charts.total[i] += 1;
            metrics.inhabitants.inhabitants.charts.total[i] += row.population_total;
            livingConditionsKeys.forEach((key) => {
                metrics.livingConditions[key].charts.inhabitants_total[i] += row.population_total;
                metrics.livingConditions[key].charts.towns_total[i] += 1;
            });

            if (row.population_total < 10) {
                metrics.inhabitants.towns.charts.less_than_10[i] += 1;
            }
            if (row.population_total >= 10 && row.population_total <= 99) {
                metrics.inhabitants.towns.charts.between_10_and_99[i] += 1;
            }
            if (row.population_total >= 100) {
                metrics.inhabitants.towns.charts.more_than_99[i] += 1;
            }
            if (row.minors_in_school !== null) {
                metrics.inhabitants.towns.charts.minors_in_school[i] += row.minors_in_school;
            }
            if (row.origins.length === 1 && row.origins[0] === 'european') {
                metrics.inhabitants.inhabitants.charts.european[i] += row.population_total;
            }
            if (row.origins.length === 1 && row.origins[0] === 'other') {
                metrics.inhabitants.inhabitants.charts.foreign[i] += row.population_total;
            }

            // on remplit les chiffres des conditions de vie


            if (livingConditionsStatuses.water.status === 'good') {
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

            if (hasJusticePermission) {
                if (row.police_status === 'granted') {
                    metrics.justice.justice.charts.police[i] += 1;
                }

                if (row.owner_complaint === true) {
                    metrics.justice.justice.charts.complaints[i] += 1;
                }
            }

            previousIndex = reportIndex;
        }
    });

    // on calcule les totaux et évolutions


    // pour les habitants
    Object.keys(metrics.inhabitants.towns.figures).forEach((key) => {
        metrics.inhabitants.towns.figures[key].value = metrics.inhabitants.towns.charts[key][listOfDates.length - 1];
        metrics.inhabitants.towns.figures[key].evolution = getEvolution(metrics.inhabitants.towns.charts[key][0], metrics.inhabitants.towns.charts[key][listOfDates.length - 1]);
    });

    Object.keys(metrics.inhabitants.inhabitants.figures).forEach((key) => {
        metrics.inhabitants.inhabitants.figures[key].value = metrics.inhabitants.inhabitants.charts[key][listOfDates.length - 1];
        metrics.inhabitants.inhabitants.figures[key].evolution = getEvolution(metrics.inhabitants.inhabitants.charts[key][0], metrics.inhabitants.inhabitants.charts[key][listOfDates.length - 1]);
    });


    // pour les conditions de vie
    livingConditionsKeys.forEach((key) => {
        Object.keys(metrics.livingConditions[key].figures).forEach((figureKey) => {
            metrics.livingConditions[key].figures[figureKey].value = metrics.livingConditions[key].charts[figureKey][listOfDates.length - 1];
            metrics.livingConditions[key].figures[figureKey].evolution = getEvolution(metrics.livingConditions[key].charts[figureKey][0], metrics.livingConditions[key].charts[figureKey][listOfDates.length - 1]);
        });
    });


    // pour la justice
    if (hasJusticePermission) {
        Object.keys(metrics.justice.justice.figures).forEach((figureKey) => {
            metrics.justice.justice.figures[figureKey].value = metrics.justice.justice.charts[figureKey][listOfDates.length - 1];
            metrics.justice.justice.figures[figureKey].evolution = getEvolution(metrics.justice.justice.charts[figureKey][0], metrics.justice.justice.charts[figureKey][listOfDates.length - 1]);
        });
    }

    return metrics;
};
