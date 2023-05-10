import dataReportModel from '#server/models/dataReportModel';
import ServiceError from '#server/errors/ServiceError';
import { DataReportRawData } from '#server/models/dataReportModel/getRawData';
import { TownReport } from './types/TownReport.d';
import initializeTownsReport from './_utils/initializeTownsReport';
import getReportIndex from './_utils/getReportIndex';

export const BIG_TOWN_SIZE = 10;

const ORIGIN_KEYS: { [key: string]: string } = {
    european: 'eu_only',
    french: 'french_only',
    other: 'extra_eu_only',
    mixed: 'mixed_origins',
    null: 'unknown_origins',
};

export default async (argFrom: Date, argTo: Date): Promise<TownReport[]> => {
    // on construit le rapport pour chaque date entre les deux dates fournies en paramètre
    // en initialisant avec des données à 0
    const reports = initializeTownsReport(argFrom, argTo);

    // on récupère chaque saisie de site en BDD, et on boucle dessus pour construire pas à pas
    // les totaux
    // (note: ces données sont triées par site PUIS par date de saisie, ce qui est capital pour
    // l'algorithme plus bas)
    let data: DataReportRawData[];
    try {
        data = await dataReportModel.getRawData(argFrom, argTo);
    } catch (error) {
        throw new ServiceError('model_failed', error);
    }

    let previousIndex;
    data.forEach((row, index) => {
        const isNew = index === 0 || row.shantytown_id !== data[index - 1].shantytown_id;
        if (isNew) {
            previousIndex = undefined;
        }

        // on récupère l'index de la première date dans notre rapport concernée par la saisie
        // (le Math.max permet de gérer le cas où la date de saisie est < from, ie. un index négatif)
        const reportIndex = Math.max(0, getReportIndex(argFrom, argTo, row.input_date));

        // on impacte les totaux des sites existants pour tous les rapports existants entre la date
        // de création du site et sa date de fermeture
        // on le fait séparément une fois ici car il s'agit de totaux qui ne dépendent pas des
        // saisies intermédiaires (contrairement au nombre de personnes)
        if (isNew) {
            const lastReportIndex = row.closed_at
                ? getReportIndex(argFrom, argTo, row.closed_at)
                : reports.length;
            for (let i = reportIndex; i < lastReportIndex; i += 1) {
                reports[i].all.all.number_of_towns.total += 1;

                if (row.population_total >= BIG_TOWN_SIZE) {
                    reports[i].big_towns_only.all.number_of_towns.total += 1;
                }

                if (row.is_oversea) {
                    reports[i].all.overseas.number_of_towns.total += 1;
                    reports[i].big_towns_only.overseas.number_of_towns.total += row.population_total >= BIG_TOWN_SIZE ? 1 : 0;
                }
            }
        }

        // on ignore les saisies intermédiaires entre deux dates
        // (par exemple si la date est "15/01/2023" mais qu'on a déjà traité "16/01/2023", on peut l'ignorer)
        if (previousIndex === reportIndex) {
            return;
        }

        // on impacte les totaux du nombre de personnes / origines pour le ou les rapports
        // concernés par la saisie en cours de traitement
        const lastReportIndex = isNew ? reports.length : previousIndex - 1;
        for (let i = reportIndex; i < lastReportIndex; i += 1) {
            reports[i].all.all.number_of_people.total += row.population_total;
            reports[i].big_towns_only.all.number_of_people.total += row.population_total >= BIG_TOWN_SIZE ? row.population_total : 0;

            // mineurs
            reports[i].all.all.number_of_people.minors += row.population_minors;
            reports[i].big_towns_only.all.number_of_people.minors += row.population_total >= BIG_TOWN_SIZE ? row.population_minors : 0;
            reports[i].all.all.number_of_people[`origins_${row.origins}_minors`] += row.population_minors;
            reports[i].big_towns_only.all.number_of_people[`origins_${row.origins}_minors`] += row.population_total >= BIG_TOWN_SIZE ? row.population_minors : 0;

            // origines
            reports[i].all.all.number_of_towns[ORIGIN_KEYS[row.origins]] += 1;
            reports[i].big_towns_only.all.number_of_towns[ORIGIN_KEYS[row.origins]] += row.population_total >= BIG_TOWN_SIZE ? 1 : 0;
            reports[i].all.all.number_of_people[`origins_${row.origins}`] += row.population_total;
            reports[i].big_towns_only.all.number_of_people[`origins_${row.origins}`] += row.population_total >= BIG_TOWN_SIZE ? row.population_total : 0;

            // outremers
            if (row.is_oversea) {
                reports[i].all.overseas.number_of_people.total += row.population_total;
                reports[i].big_towns_only.overseas.number_of_people.total += row.population_total >= BIG_TOWN_SIZE ? row.population_total : 0;
            }
        }

        previousIndex = reportIndex;
    });

    return reports;
};
