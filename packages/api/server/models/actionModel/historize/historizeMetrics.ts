import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default function historizeMetrics(id: number, hid: number, transaction: Transaction): Promise<[number, number]> {
    return sequelize.query(`
        INSERT INTO action_metrics_history(
            fk_action,
            date,
            nombre_personnes,
            nombre_menages,
            nombre_femmes,
            nombre_mineurs,
            sante_nombre_personnes,
            travail_nombre_personnes,
            travail_nombre_femmes,
            hebergement_nombre_personnes,
            hebergement_nombre_menages,
            logement_nombre_personnes,
            logement_nombre_menages,
            scolaire_mineurs_moins_de_trois_ans,
            scolaire_mineurs_trois_ans_et_plus,
            scolaire_mediation_moins_de_trois_ans,
            scolaire_mediation_trois_ans_et_plus,
            scolaire_nombre_maternelle,
            scolaire_nombre_elementaire,
            scolaire_nombre_college,
            scolaire_nombre_lycee,
            scolaire_nombre_autre,
            scolaire_mineur_scolarise_dans_annee,
            created_at,
            created_by
        ) (
            SELECT
                :hid,
                date,
                nombre_personnes,
                nombre_menages,
                nombre_femmes,
                nombre_mineurs,
                sante_nombre_personnes,
                travail_nombre_personnes,
                travail_nombre_femmes,
                hebergement_nombre_personnes,
                hebergement_nombre_menages,
                logement_nombre_personnes,
                logement_nombre_menages,
                scolaire_mineurs_moins_de_trois_ans,
                scolaire_mineurs_trois_ans_et_plus,
                scolaire_mediation_moins_de_trois_ans,
                scolaire_mediation_trois_ans_et_plus,
                scolaire_nombre_maternelle,
                scolaire_nombre_elementaire,
                scolaire_nombre_college,
                scolaire_nombre_lycee,
                scolaire_nombre_autre,
                scolaire_mineur_scolarise_dans_annee,
                created_at,
                created_by
            FROM action_metrics
            WHERE fk_action = :id
        )`,
    {
        type: QueryTypes.INSERT,
        transaction,
        replacements: {
            id,
            hid,
        },
    });
}
