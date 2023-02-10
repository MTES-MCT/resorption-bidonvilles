import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { ActionRow } from './ActionRow';

export default (authorId: number, actionId: number, date: Date, data: ActionRow, transaction: Transaction) => sequelize.query(
    `INSERT INTO action_metrics(
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
        scolaire_mineurs_scolarisables,
        scolaire_mineurs_en_mediation,
        scolaire_nombre_maternelle,
        scolaire_nombre_elementaire,
        scolaire_nombre_college,
        scolaire_nombre_lycee,
        scolaire_nombre_autre,
        created_by
    ) VALUES (
        :action_id,
        :date,
        :nombre_personnes,
        :nombre_menages,
        :nombre_femmes,
        :nombre_mineurs,
        :sante_nombre_personnes,
        :travail_nombre_personnes,
        :travail_nombre_femmes,
        :hebergement_nombre_personnes,
        :hebergement_nombre_menages,
        :logement_nombre_personnes,
        :logement_nombre_menages,
        :scolaire_mineurs_scolarisables,
        :scolaire_mineurs_en_mediation,
        :scolaire_nombre_maternelle,
        :scolaire_nombre_elementaire,
        :scolaire_nombre_college,
        :scolaire_nombre_lycee,
        :scolaire_nombre_autre,
        :author_id
    )`,
    {
        type: QueryTypes.INSERT,
        transaction,
        replacements: {
            ...data,
            author_id: authorId,
            date,
            action_id: actionId,
        },
    },
);
