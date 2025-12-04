import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { ActionInput } from '#server/services/action/ActionInput.d';

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
];

export default (actionId: number, authorId: number, data: ActionInput, transaction: Transaction) => {
    const numberOfRows = Object.keys(data.indicateurs).length;
    const today = new Date();

    const placeholders = `(${COLUMNS.map(() => '?').join(', ')})`;

    return sequelize.query(
        `INSERT INTO action_metrics(
            ${COLUMNS.join(',\n            ')}
        ) VALUES
            ${new Array(numberOfRows).fill(placeholders).join(',')}`,
        {
            type: QueryTypes.INSERT,
            transaction,
            replacements: Object.keys(data.indicateurs).map((strYear) => {
                const year = parseInt(strYear, 10);

                return [
                    actionId,
                    year < today.getFullYear() ? new Date(year, 11, 31, 23, 59, 59) : today,
                    data.indicateurs[strYear].nombre_personnes,
                    data.indicateurs[strYear].nombre_menages,
                    data.indicateurs[strYear].nombre_femmes,
                    data.indicateurs[strYear].nombre_mineurs,
                    data.indicateurs[strYear].sante_nombre_personnes,
                    data.indicateurs[strYear].travail_nombre_personnes,
                    data.indicateurs[strYear].travail_nombre_femmes,
                    data.indicateurs[strYear].hebergement_nombre_personnes,
                    data.indicateurs[strYear].hebergement_nombre_menages,
                    data.indicateurs[strYear].logement_nombre_personnes,
                    data.indicateurs[strYear].logement_nombre_menages,
                    data.indicateurs[strYear].scolaire_mineurs_moins_de_trois_ans,
                    data.indicateurs[strYear].scolaire_mineurs_trois_ans_et_plus,
                    data.indicateurs[strYear].scolaire_mediation_moins_de_trois_ans,
                    data.indicateurs[strYear].scolaire_mediation_trois_ans_et_plus,
                    data.indicateurs[strYear].scolaire_nombre_maternelle,
                    data.indicateurs[strYear].scolaire_nombre_elementaire,
                    data.indicateurs[strYear].scolaire_nombre_college,
                    data.indicateurs[strYear].scolaire_nombre_lycee,
                    data.indicateurs[strYear].scolaire_nombre_autre,
                    data.indicateurs[strYear].scolaire_mineur_scolarise_dans_annee,
                    authorId,
                ];
            }).flat(),
        },
    );
};
