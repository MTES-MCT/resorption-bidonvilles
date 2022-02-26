const { sequelize } = require('#db/models');

module.exports = async () => sequelize.query(
    `SELECT
            p.plan_id AS action_id,
            p."name" AS action_desc,
            TO_CHAR(p.started_at :: DATE, 'dd/mm/yyyy') AS action_date_debut,
            TO_CHAR(p.closed_at :: DATE, 'dd/mm/yyyy') AS action_date_fermeture,
            TO_CHAR(p.expected_to_end_at :: DATE, 'dd/mm/yyyy') AS action_date_fermeture_supposee,
            p.created_by AS action_auteur_saisie_id,
            INITCAP(uc.first_name) AS action_auteur_saisie_prenom,
            UPPER(uc.last_name) AS action_auteur_saisie_nom,
            TO_CHAR(p.created_at :: DATE, 'dd/mm/yyyy') AS action_saisie_date,
            p.updated_by AS action_auteur_maj_id,
            INITCAP(uu.first_name) AS action_auteur_maj_prenom,
            UPPER(uu.last_name) AS action_auteur_maj_nom,
            TO_CHAR(p.updated_at :: DATE, 'dd/mm/yyyy') AS action_maj_date,
            pmu.managers AS pilotes,
            pou.operators AS operateurs,
            pt.topics,
            TO_CHAR(ps.last_date_reference_indicators :: DATE, 'dd/mm/yyyy') AS date_reference_indicateurs,
            TO_CHAR(ps.last_effective_date_indicators :: DATE, 'dd/mm/yyyy') AS date_saisie_effective_indicateurs
    FROM 
            plans2 p
    LEFT JOIN
            plan_departements pd ON pd.fk_plan = p.plan_id 
    LEFT JOIN
            (
                SELECT
                        p2.plan_id AS fk_plan,
                        string_agg(t."name", E'\n') AS topics
                FROM
                        topics t
                LEFT JOIN
                        plan_topics pt ON pt.fk_topic = t.uid 
                LEFT JOIN 
                        plans2 p2 ON p2.plan_id = pt.fk_plan
                GROUP BY
                        p2.plan_id 
            ) AS pt ON pt.fk_plan = p.plan_id 
    LEFT JOIN
            users uc ON uc.user_id = p.created_by 
    LEFT JOIN
            users uu ON uu.user_id = p.updated_by 
    LEFT JOIN
            (
                SELECT
                        pm.fk_plan,
                        string_agg(CONCAT(INITCAP(pmu2.first_name), ' ', UPPER(pmu2.last_name)), E'\n') AS managers
                FROM
                        plan_managers pm
                LEFT JOIN
                        users pmu2 ON pmu2.user_id  = pm.fk_user
                GROUP BY
                        pm.fk_plan
            ) AS pmu ON pmu.fk_plan = p.plan_id 
    LEFT JOIN
            (
                SELECT
                        po2.fk_plan,
                        string_agg(CONCAT(INITCAP(pou2.first_name), ' ', UPPER(pou2.last_name)), E'\n') AS operators
                FROM
                        plan_operators po2
                LEFT JOIN
                        users pou2 ON pou2.user_id  = po2.fk_user
                GROUP BY
                        po2.fk_plan
            ) AS pou ON pou.fk_plan = p.plan_id 
    LEFT JOIN
            (
                SELECT 
                        psi.fk_plan,
                        psi.date AS last_date_reference_indicators,
                        psi.created_at AS last_effective_date_indicators
                FROM
                        plan_states psi
                WHERE
                        psi.date = 
                        (
                            SELECT
                                    MAX(psi2.date)
                            FROM
                                    plan_states psi2
                            WHERE
                                    psi2.fk_plan  = psi.fk_plan
                        )
            ) AS ps ON ps.fk_plan = p.plan_id ;`,
    {
        type: sequelize.QueryTypes.SELECT,
    },
);
