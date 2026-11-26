import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { ActionInput } from '#server/services/action/ActionInput.d';
import hasMetricValues from '#server/services/action/_common/hasMetricValues';
import { SCOLAIRE_KEYS, NON_SCOLAIRE_KEYS, hasAnyValue } from '../_common/indicatorKeys';

const COLUMNS = [
    'fk_action',
    'date',
    'nombre_personnes',
    'nombre_menages',
    'nombre_femmes',
    'nombre_mineurs',
    'sante_nombre_personnes',
    'travail_nombre_personnes',
    'travail_nombre_femmes',
    'hebergement_nombre_personnes',
    'hebergement_nombre_menages',
    'logement_nombre_personnes',
    'logement_nombre_menages',
    'scolaire_mineurs_moins_de_trois_ans',
    'scolaire_mineurs_trois_ans_et_plus',
    'scolaire_mediation_moins_de_trois_ans',
    'scolaire_mediation_trois_ans_et_plus',
    'scolaire_nombre_maternelle',
    'scolaire_nombre_elementaire',
    'scolaire_nombre_college',
    'scolaire_nombre_lycee',
    'scolaire_nombre_autre',
    'scolaire_mineur_scolarise_dans_annee',
    'updated_at_indicators',
    'updated_at_scolaire',
    'created_by',
] as const;

type NatureDates = { updated_at_indicators: Date | null, updated_at_scolaire: Date | null };

export default function insertMetrics(actionId: number, authorId: number, data: ActionInput, transaction: Transaction, versionId?: number | null, datesByYear?: Record<string, NatureDates>) {
    // sans versionId (création d'action), la colonne fk_version n'est pas écrite : requête inchangée
    const columns: readonly string[] = versionId === undefined ? COLUMNS : [...COLUMNS, 'fk_version'];
    const today = new Date();

    const yearsWithData = Object.keys(data.indicateurs).filter(strYear => hasMetricValues(data.indicateurs[strYear]));

    if (yearsWithData.length === 0) {
        return Promise.resolve();
    }

    const numberOfRows = yearsWithData.length;

    const placeholders = `(${columns.map(() => '?').join(', ')})`;

    return sequelize.query(
        `INSERT INTO action_metrics(
            ${columns.join(',\n            ')}
        ) VALUES
            ${new Array(numberOfRows).fill(placeholders).join(',')}`,
        {
            type: QueryTypes.INSERT,
            transaction,
            replacements: yearsWithData.flatMap((strYear) => {
                const year = Number.parseInt(strYear, 10);
                const indicateur = data.indicateurs[strYear];
                const natureDates = datesByYear
                    ? [datesByYear[strYear]?.updated_at_indicators ?? null, datesByYear[strYear]?.updated_at_scolaire ?? null]
                    : [
                        hasAnyValue(indicateur, NON_SCOLAIRE_KEYS) ? today : null,
                        hasAnyValue(indicateur, SCOLAIRE_KEYS) ? today : null,
                    ];

                const values = [
                    actionId,
                    year < today.getFullYear() ? new Date(year, 11, 31, 23, 59, 59) : today,
                    indicateur.nombre_personnes ?? null,
                    indicateur.nombre_menages ?? null,
                    indicateur.nombre_femmes ?? null,
                    indicateur.nombre_mineurs ?? null,
                    indicateur.sante_nombre_personnes ?? null,
                    indicateur.travail_nombre_personnes ?? null,
                    indicateur.travail_nombre_femmes ?? null,
                    indicateur.hebergement_nombre_personnes ?? null,
                    indicateur.hebergement_nombre_menages ?? null,
                    indicateur.logement_nombre_personnes ?? null,
                    indicateur.logement_nombre_menages ?? null,
                    indicateur.scolaire_mineurs_moins_de_trois_ans ?? null,
                    indicateur.scolaire_mineurs_trois_ans_et_plus ?? null,
                    indicateur.scolaire_mediation_moins_de_trois_ans ?? null,
                    indicateur.scolaire_mediation_trois_ans_et_plus ?? null,
                    indicateur.scolaire_nombre_maternelle ?? null,
                    indicateur.scolaire_nombre_elementaire ?? null,
                    indicateur.scolaire_nombre_college ?? null,
                    indicateur.scolaire_nombre_lycee ?? null,
                    indicateur.scolaire_nombre_autre ?? null,
                    indicateur.scolaire_mineur_scolarise_dans_annee ?? null,
                    ...natureDates,
                    authorId,
                ];

                return versionId === undefined ? values : [...values, versionId];
            }),
        },
    );
}
