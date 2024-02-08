import ServiceError from '#server/errors/ServiceError';
import dataReportModel from '#server/models/dataReportModel';
import { DataReportRawData } from '#server/models/dataReportModel/getRawData';
import getReportIndex from './_utils/getReportIndex';
import initializeTownsReport from './_utils/initializeTownsReport';
import { TownReport } from './types/TownReport.d';

export const BIG_TOWN_SIZE = 10;

const ORIGIN_KEYS: { [key: string]: string } = {
    european: 'eu_only',
    french: 'french_only',
    other: 'extra_eu_only',
    mixed: 'mixed_origins',
    null: 'unknown_origins',
};

const POPULATION_SEGMENTS: { min: number, max: number }[] = [
    { min: 10, max: 50 },
    { min: 51, max: 100 },
    { min: 101, max: 150 },
    { min: 151, max: 200 },
    { min: 201, max: 250 },
    { min: 251, max: Infinity },
];

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
        const isLast = data[index + 1]?.shantytown_id !== row.shantytown_id;
        const territoryKey = row.is_oversea ? 'overseas' : 'metropolitan';
        if (isNew) {
            previousIndex = undefined;
        }

        // on récupère l'index de la première date dans notre rapport concernée par la saisie
        // (le Math.max permet de gérer le cas où la date de saisie est < from, ie. un index négatif)
        const reportIndex = Math.max(
            0,
            getReportIndex(argFrom, argTo, isLast ? row.known_since : row.input_date),
        );

        // on impacte les totaux des sites existants pour tous les rapports existants entre la date
        // de création du site et sa date de fermeture
        // on le fait séparément une fois ici car il s'agit de totaux qui ne dépendent pas des
        // saisies intermédiaires (contrairement au nombre de personnes)
        const maxReportIndex = row.closed_at
            ? getReportIndex(argFrom, argTo, row.closed_at)
            : reports.length;
        if (isNew) {
            const minReportIndex = Math.max(
                0,
                getReportIndex(argFrom, argTo, row.known_since),
            );
            for (let i = minReportIndex; i < maxReportIndex; i += 1) {
                reports[i].all_sizes[territoryKey].number_of_towns.total += 1;
                reports[i].big_towns_only[territoryKey].number_of_towns.total += row.population_total >= BIG_TOWN_SIZE ? 1 : 0;
            }
        }

        // on ignore les saisies intermédiaires entre deux dates
        // (par exemple si la date est "15/01/2023" mais qu'on a déjà traité "16/01/2023", on peut l'ignorer
        // car il s'agit du même rapport)
        if (previousIndex === reportIndex) {
            return;
        }

        // on impacte les totaux du nombre de personnes / origines pour le ou les rapports
        // concernés par la saisie en cours de traitement
        const maxReportIndexForPeople = previousIndex !== undefined ? previousIndex : maxReportIndex;
        for (let i = reportIndex; i < maxReportIndexForPeople; i += 1) {
            reports[i].all_sizes[territoryKey].number_of_people.total += row.population_total;
            reports[i].big_towns_only[territoryKey].number_of_people.total += row.population_total >= BIG_TOWN_SIZE ? row.population_total : 0;

            POPULATION_SEGMENTS.forEach(({ min, max }) => {
                if (row.population_total >= min && row.population_total <= max) {
                    const ref = Number.isFinite(max) ? `population_${min}_${max}` : `population_${min}_or_more`;
                    reports[i][ref][territoryKey].all_ids.push(row.shantytown_id);
                    reports[i][ref][territoryKey].all += 1;
                    reports[i][ref][territoryKey].european += row.origins === 'european' ? 1 : 0;
                }
            });

            // mineurs
            reports[i].all_sizes[territoryKey].number_of_people.minors += row.population_minors;
            reports[i].big_towns_only[territoryKey].number_of_people.minors += row.population_total >= BIG_TOWN_SIZE ? row.population_minors : 0;
            reports[i].all_sizes[territoryKey].number_of_people[`origins_${row.origins}_minors`] += row.population_minors;
            reports[i].big_towns_only[territoryKey].number_of_people[`origins_${row.origins}_minors`] += row.population_total >= BIG_TOWN_SIZE ? row.population_minors : 0;

            // origines
            reports[i].all_sizes[territoryKey].number_of_towns[ORIGIN_KEYS[row.origins]] += 1;
            reports[i].big_towns_only[territoryKey].number_of_towns[ORIGIN_KEYS[row.origins]] += row.population_total >= BIG_TOWN_SIZE ? 1 : 0;
            reports[i].all_sizes[territoryKey].number_of_people[`origins_${row.origins}`] += row.population_total;
            reports[i].big_towns_only[territoryKey].number_of_people[`origins_${row.origins}`] += row.population_total >= BIG_TOWN_SIZE ? row.population_total : 0;
        }

        previousIndex = reportIndex;
    });

    return reports;
};
