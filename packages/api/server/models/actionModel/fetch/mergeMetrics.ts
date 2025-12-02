import { ActionHash } from './hashActions';
import { ActionMetricsRow } from './fetchMetrics';

/* eslint-disable no-param-reassign */
export default function mergeMetrics(hash: ActionHash, metrics: ActionMetricsRow[]): void {
    metrics.forEach((row) => {
        if (row.rank > 1) {
            return;
        }

        if (!hash[row.action_id]) {
            return;
        }

        const metricCreatedAt = row.created_at.getTime();

        if (hash[row.action_id].metrics_updated_at === null || metricCreatedAt > hash[row.action_id].metrics_updated_at) {
            hash[row.action_id].metrics_updated_at = metricCreatedAt;
        }

        hash[row.action_id].metrics.push({
            date: new Date(row.date).getTime(),
            nombre_personnes: row.nombre_personnes,
            nombre_menages: row.nombre_menages,
            nombre_femmes: row.nombre_femmes,
            nombre_mineurs: row.nombre_mineurs,
            sante_nombre_personnes: row.sante_nombre_personnes,
            travail_nombre_personnes: row.travail_nombre_personnes,
            travail_nombre_femmes: row.travail_nombre_femmes,
            hebergement_nombre_personnes: row.hebergement_nombre_personnes,
            hebergement_nombre_menages: row.hebergement_nombre_menages,
            logement_nombre_personnes: row.logement_nombre_personnes,
            logement_nombre_menages: row.logement_nombre_menages,
            scolaire_mineurs_trois_ans_et_plus: row.scolaire_mineurs_trois_ans_et_plus,
            scolaire_mineurs_en_mediation: row.scolaire_mineurs_en_mediation,
            scolaire_nombre_maternelle: row.scolaire_nombre_maternelle,
            scolaire_nombre_elementaire: row.scolaire_nombre_elementaire,
            scolaire_nombre_college: row.scolaire_nombre_college,
            scolaire_nombre_lycee: row.scolaire_nombre_lycee,
            scolaire_nombre_autre: row.scolaire_nombre_autre,
            created_at: row.created_at.getTime(),
            created_by: {
                id: row.creator_id,
                first_name: row.creator_first_name,
                last_name: row.creator_last_name,
                organization: {
                    id: row.creator_organization_id,
                    name: row.creator_organization_name,
                    abbreviation: row.creator_organization_abbreviation,
                },
            },
        });
    });
}
