import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async () => sequelize.query(
    `WITH
    grouped_topics AS (
        SELECT
            fk_action,
            string_agg(name, E'\n') AS topics
        FROM action_topics
        LEFT JOIN topics ON action_topics.fk_topic = topics.uid
        GROUP BY action_topics.fk_action
    ),
    grouped_managers AS (
        SELECT
            fk_action,
            string_agg(CONCAT(INITCAP(first_name), ' ', UPPER(last_name)), E'\n') AS managers
        FROM action_managers
        LEFT JOIN users ON users.user_id = action_managers.fk_user
        GROUP BY fk_action
    ),
    grouped_operators AS (
        SELECT
            fk_action,
            string_agg(CONCAT(INITCAP(first_name), ' ', UPPER(last_name)), E'\n') AS operators
        FROM action_operators
        LEFT JOIN users ON users.user_id  = action_operators.fk_user
        GROUP BY fk_action
    )

    SELECT
        actions.action_id AS "Identifiant",
        actions."name" AS "Description",
        TO_CHAR(actions.started_at::DATE, 'dd/mm/yyyy') AS "Date de début",
        TO_CHAR(actions.ended_at::DATE, 'dd/mm/yyyy') AS "Date de fin",
        actions.created_by AS "Saisie par (identifiant)",
        UPPER(creators.last_name) || ' ' || INITCAP(creators.first_name) AS "Saisie par (nom)",
        TO_CHAR(actions.created_at::DATE, 'dd/mm/yyyy') AS "Saisie le",
        actions.updated_by AS "Dernière mise à jour par (identifiant)",
        UPPER(updators.last_name) || ' ' || INITCAP(updators.first_name) AS "Dernière mise à jour par (nom)",
        TO_CHAR(actions.updated_at::DATE, 'dd/mm/yyyy') AS "Dernière mise à jour le",
        grouped_managers.managers AS "Pilotes",
        grouped_operators.operators AS "Opérateurs",
        topics.topics AS "Champs d''intervention"
    FROM actions
    LEFT JOIN users creators ON creators.user_id = actions.created_by
    LEFT JOIN users updators ON updators.user_id = actions.updated_by
    LEFT JOIN grouped_topics AS topics ON topics.fk_action = actions.action_id
    LEFT JOIN grouped_managers ON grouped_managers.fk_action = actions.action_id
    LEFT JOIN grouped_operators ON grouped_operators.fk_action = actions.action_id`,
    {
        type: QueryTypes.SELECT,
    },
);
