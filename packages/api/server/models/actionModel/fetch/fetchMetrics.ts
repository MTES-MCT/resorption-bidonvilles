import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import enrichWhere from './enrichWhere';

export type ActionMetricsRow = {
    rank: number,
    action_id: number,
    date: string,
    nombre_personnes: number | null,
    nombre_menages: number | null,
    nombre_femmes: number | null,
    nombre_mineurs: number | null,
    sante_nombre_personnes: number | null,
    travail_nombre_personnes: number | null,
    travail_nombre_femmes: number | null,
    hebergement_nombre_personnes: number | null,
    hebergement_nombre_menages: number | null,
    logement_nombre_personnes: number | null,
    logement_nombre_menages: number | null,
    scolaire_mineurs_moins_de_trois_ans: number | null,
    scolaire_mineurs_trois_ans_et_plus: number | null,
    scolaire_mediation_moins_de_trois_ans: number | null,
    scolaire_mediation_trois_ans_et_plus: number | null,
    scolaire_nombre_maternelle: number | null,
    scolaire_nombre_elementaire: number | null,
    scolaire_nombre_college: number | null,
    scolaire_nombre_lycee: number | null,
    scolaire_nombre_autre: number | null,
    scolaire_mineur_scolarise_dans_annee: number | null,
    created_at: Date,
    creator_id: number,
    creator_first_name: string,
    creator_last_name: string,
    creator_organization_id: number,
    creator_organization_name: string,
    creator_organization_abbreviation: string | null,
};

export default function fetchMetrics(actionIds: number[] = null, clauseGroup: object = {}, transaction?: Transaction): Promise<ActionMetricsRow[]> {
    const where = [];
    const replacements = { actionIds };
    if (actionIds !== null) {
        where.push('action_metrics.fk_action IN (:actionIds)');
    }

    enrichWhere(where, replacements, clauseGroup);

    return sequelize.query(
        `
        SELECT
            action_metrics.fk_action AS action_id,
            action_metrics.date,
            action_metrics.nombre_personnes,
            action_metrics.nombre_menages,
            action_metrics.nombre_femmes,
            action_metrics.nombre_mineurs,
            action_metrics.sante_nombre_personnes,
            action_metrics.travail_nombre_personnes,
            action_metrics.travail_nombre_femmes,
            action_metrics.hebergement_nombre_personnes,
            action_metrics.hebergement_nombre_menages,
            action_metrics.logement_nombre_personnes,
            action_metrics.logement_nombre_menages,
            action_metrics.scolaire_mineurs_moins_de_trois_ans,
            action_metrics.scolaire_mineurs_trois_ans_et_plus,
            action_metrics.scolaire_mediation_moins_de_trois_ans,
            action_metrics.scolaire_mediation_trois_ans_et_plus,
            action_metrics.scolaire_nombre_maternelle,
            action_metrics.scolaire_nombre_elementaire,
            action_metrics.scolaire_nombre_college,
            action_metrics.scolaire_nombre_lycee,
            action_metrics.scolaire_nombre_autre,
            action_metrics.scolaire_mineur_scolarise_dans_annee,
            action_metrics.created_at,
            creator.user_id AS creator_id,
            creator.first_name AS creator_first_name,
            creator.last_name AS creator_last_name,
            creator_organizations.organization_id AS creator_organization_id,
            creator_organizations.name AS creator_organization_name,
            creator_organizations.abbreviation AS creator_organization_abbreviation,
            RANK() OVER(
                PARTITION BY action_metrics.fk_action
                ORDER BY date_trunc('seconds', action_metrics.created_at) DESC
            ) AS rank
        FROM action_metrics
        LEFT JOIN users AS creator ON action_metrics.created_by = creator.user_id
        LEFT JOIN organizations AS creator_organizations ON creator.fk_organization = creator_organizations.organization_id
        LEFT JOIN actions ON action_metrics.fk_action = actions.action_id
        LEFT JOIN departements ON actions.fk_departement = departements.code
        LEFT JOIN regions ON departements.fk_region = regions.code
        ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY action_metrics.date DESC
        `,
        {
            type: QueryTypes.SELECT,
            replacements,
            transaction,
        },
    );
}
