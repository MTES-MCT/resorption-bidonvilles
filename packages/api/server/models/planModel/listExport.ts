import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async () => sequelize.query(
    `WITH
    grouped_topics AS (
        SELECT
            fk_plan,
            string_agg(name, E'\n') AS topics
        FROM plan_topics
        LEFT JOIN topics ON plan_topics.fk_topic = topics.uid
        GROUP BY plan_topics.fk_plan
    ),
    grouped_managers AS (
        SELECT
            fk_plan,
            string_agg(CONCAT(INITCAP(first_name), ' ', UPPER(last_name)), E'\n') AS managers
        FROM plan_managers
        LEFT JOIN users ON users.user_id = plan_managers.fk_user
        GROUP BY fk_plan
    ),
    grouped_operators AS (
        SELECT
            fk_plan,
            string_agg(CONCAT(INITCAP(first_name), ' ', UPPER(last_name)), E'\n') AS operators
        FROM plan_operators
        LEFT JOIN users ON users.user_id  = plan_operators.fk_user
        GROUP BY fk_plan
    ),
    last_plan_states AS (
        SELECT
            fk_plan,
            last_date_reference_indicators,
            last_effective_date_indicators
        FROM (
            SELECT 
                fk_plan,
                DATE AS last_date_reference_indicators,
                created_at AS last_effective_date_indicators,
                RANK() OVER(PARTITION BY fk_plan ORDER BY DATE DESC) AS "rank"
            FROM plan_states
        ) AS t
        WHERE RANK = 1
    )

    SELECT
        actions.plan_id AS "Identifiant",
        actions."name" AS "Description",
        TO_CHAR(actions.started_at::DATE, 'dd/mm/yyyy') AS "Date de début",
        TO_CHAR(actions.expected_to_end_at::DATE, 'dd/mm/yyyy') AS "Date de fin prévue",
        TO_CHAR(actions.closed_at::DATE, 'dd/mm/yyyy') AS "Date de fin effective",
        actions.created_by AS "Saisie par (identifiant)",
        UPPER(creators.last_name) || ' ' || INITCAP(creators.first_name) AS "Saisie par (nom)",
        TO_CHAR(actions.created_at::DATE, 'dd/mm/yyyy') AS "Saisie le",
        actions.updated_by AS "Dernière mise à jour par (identifiant)",
        UPPER(updators.last_name) || ' ' || INITCAP(updators.first_name) AS "Dernière mise à jour par (nom)",
        TO_CHAR(actions.updated_at::DATE, 'dd/mm/yyyy') AS "Dernière mise à jour le",
        grouped_managers.managers AS "Pilotes",
        grouped_operators.operators AS "Opérateurs",
        topics.topics AS "Champs d'intervention",
        TO_CHAR(last_plan_states.last_date_reference_indicators::DATE, 'dd/mm/yyyy') AS "Derniers indicateurs correspondant à la date du",
        TO_CHAR(last_plan_states.last_effective_date_indicators::DATE, 'dd/mm/yyyy') AS "Derniers indicateurs saisis le"
    FROM plans2 actions
    LEFT JOIN users creators ON creators.user_id = actions.created_by
    LEFT JOIN users updators ON updators.user_id = actions.updated_by
    LEFT JOIN grouped_topics AS topics ON topics.fk_plan = actions.plan_id
    LEFT JOIN grouped_managers ON grouped_managers.fk_plan = actions.plan_id
    LEFT JOIN grouped_operators ON grouped_operators.fk_plan = actions.plan_id
    LEFT JOIN last_plan_states ON last_plan_states.fk_plan = actions.plan_id`,
    {
        type: QueryTypes.SELECT,
    },
);
