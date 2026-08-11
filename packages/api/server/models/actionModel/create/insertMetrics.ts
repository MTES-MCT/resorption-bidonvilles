import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { ActionInput } from '#server/services/action/ActionInput.d';
import hasMetricValues from '#server/services/action/_common/hasMetricValues';

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
    'created_by',
] as const;

export default function insertMetrics(actionId: number, authorId: number, data: ActionInput, transaction: Transaction) {
    const today = new Date();

    const yearsWithData = Object.keys(data.indicateurs).filter(strYear => hasMetricValues(data.indicateurs[strYear]));

    if (yearsWithData.length === 0) {
        return Promise.resolve();
    }

    const numberOfRows = yearsWithData.length;

    const placeholders = `(${COLUMNS.map(() => '?').join(', ')})`;

    return sequelize.query(
        `INSERT INTO action_metrics(
            ${COLUMNS.join(',\n            ')}
        ) VALUES
            ${new Array(numberOfRows).fill(placeholders).join(',')}`,
        {
            type: QueryTypes.INSERT,
            transaction,
            replacements: yearsWithData.flatMap((strYear) => {
                const year = Number.parseInt(strYear, 10);
                const indicateur = data.indicateurs[strYear];

                return [
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
                    authorId,
                ];
            }),
        },
    );
}
