import { Shantytown } from '#root/types/resources/Shantytown.d';
import formatDate from '../../_common/formatDate';

const intToStr = (int, nullValue = 'NC') => {
    if (int === undefined || int === null) {
        return nullValue;
    }

    return int;
};

type TownExportPopulationHistoryRow = {
    date: string,
    populationTotal: number,
    populationTotalFemales: number,
    populationCouples: number,
    populationMinors: number,
    populationMinorsGirls: number,
    populationMinors0To3: number,
    populationMinors3To6: number,
    populationMinors6To12: number,
    populationMinors12To16: number,
    populationMinors16To18: number,
    minorsInSchool: number,
    caravans: number,
    huts: number,
    tents: number,
    cars: number,
    mattresses: number,
};

export default (town: Shantytown): TownExportPopulationHistoryRow[] => {
    // valeurs présentes
    const ref = {
        populationTotal: intToStr(town.populationTotal, '-'),
        populationTotalFemales: intToStr(town.populationTotalFemales, '-'),
        populationCouples: intToStr(
            town.populationCouples,
            '-',
        ),
        populationMinors: intToStr(
            town.populationMinors,
            '-',
        ),
        populationMinorsGirls: intToStr(
            town.populationMinorsGirls,
            '-',
        ),
        populationMinors0To3: intToStr(
            town.populationMinors0To3,
            '-',
        ),
        populationMinors3To6: intToStr(
            town.populationMinors3To6,
            '-',
        ),
        populationMinors6To12: intToStr(
            town.populationMinors6To12,
            '-',
        ),
        populationMinors12To16: intToStr(
            town.populationMinors12To16,
            '-',
        ),
        populationMinors16To18: intToStr(
            town.populationMinors16To18,
            '-',
        ),
        minorsInSchool: intToStr(town.minorsInSchool, '-'),
        caravans: intToStr(town.caravans, '-'),
        huts: intToStr(town.huts, '-'),
        tents: intToStr(town.tents, '-'),
        cars: intToStr(town.cars, '-'),
        mattresses: intToStr(town.mattresses, '-'),
    };

    // on traite le changelog pour n'y conserver que les étapes qui contiennent au moins un changement sur les champs de population
    const entries = town.changelog
        .map(entry => ({
            ...entry,
            diff: entry.diff.filter(
                ({ fieldKey }) => fieldKey.startsWith('population')
                    || fieldKey === 'minorsInSchool'
                    || fieldKey === 'caravans'
                    || fieldKey === 'huts'
                    || fieldKey === 'tents'
                    || fieldKey === 'cars'
                    || fieldKey === 'mattresses',
            ),
        }))
        .filter(({ diff }) => diff.length > 0);

    // s'il n'y a jamais eu de changement sur les champs de population, on a une seule entrée dans l'historique, à savoir les valeurs présentes, à la date de déclaration du site sur la plateforme
    if (entries.length === 0) {
        return [
            {
                ...ref,
                date: formatDate(town.createdAt, 'DD MMMM YYYY'),
            },
        ];
    }

    // s'il y a eu au moins une modification
    return [
        // la première entrée dans l'historique correspond aux valeurs présentes, à la date de dernière modification
        {
            ...ref,
            date: formatDate(entries[0].date, 'DD MMMM YYYY'),
        },

        // puis on ajoute une entrée dans l'historique pour chaque entrée dans le changelog
        ...entries.map(({ diff }, index) => {
            // on reconstitue l'état "old" à ajouter dans l'historique
            diff.forEach(({ fieldKey, oldValue }) => {
                ref[fieldKey] = oldValue === 'non renseigné' ? '-' : oldValue;
            });

            // la date associée à cet état "old" est soit la date de l'entrée suivante dans le changelog s'il y en a une, soit la date de déclaration du site
            let date;
            if (index < entries.length - 1) {
                ({ date } = entries[index + 1]);
            } else {
                date = town.createdAt;
            }

            return {
                ...ref,
                date: formatDate(date, 'DD MMMM YYYY'),
            };
        }),
    ];
};
