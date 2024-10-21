import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { ActionReportRow } from '#root/types/resources/Action.d';

export default (requestedYear: number): Promise<ActionReportRow[]> => sequelize.query<ActionReportRow>(
    `WITH
        last_comments AS (
            WITH actioncomments AS (
                SELECT
                    ac.fk_action,
                    ac.description,
                    ac.created_at AS "last_comment_date"
                FROM
                    action_comments ac
                WHERE 
                    ac.created_at = (
                        SELECT 
                            MAX(ac2.created_at)
                        FROM
                            action_comments ac2
                        WHERE
                            ac2.fk_action = ac.fk_action
                    )
            )
            SELECT
                fk_action,
                description,
                last_comment_date
            FROM
                actioncomments
        ),
        actioncomments AS (
            SELECT 
                ac.fk_action,
                array_agg(TO_CHAR(ac.created_at, 'DD/MM/YYYY') || ' - ' || ac.description) AS "description"
            FROM 
                action_comments ac 
            WHERE 
                TO_CHAR(ac.created_at, 'YYYY') = :annee::varchar
            GROUP BY
                ac.fk_action
        ),
        finances AS
        (
            SELECT
            af.fk_action as "action_id",
            af."year" as "Année",
            SUM(CASE WHEN af.fk_action_finance_type = 'etatique' THEN af.amount ELSE 0 END) as "finance_etatique",
            SUM(CASE WHEN af.fk_action_finance_type = 'dedie' THEN af.amount ELSE 0 END) as "finance_dedie",
            SUM(CASE WHEN af.fk_action_finance_type = 'collectivite' THEN af.amount ELSE 0 END) as "finance_collectivite",
            SUM(CASE WHEN af.fk_action_finance_type = 'europeen' THEN af.amount ELSE 0 END) as "finance_europeen",
            SUM(CASE WHEN af.fk_action_finance_type = 'prive' THEN af.amount ELSE 0 END) as "finance_prive",
            SUM(CASE WHEN af.fk_action_finance_type = 'autre' THEN af.amount ELSE 0 END) as "finance_autre",
            SUM(CASE WHEN af.fk_action_finance_type = 'etatique' THEN af.real_amount ELSE 0 END) as "depense_finance_etatique",
            SUM(CASE WHEN af.fk_action_finance_type = 'dedie' THEN af.real_amount ELSE 0 END) as "depense_finance_dedie",
            SUM(CASE WHEN af.fk_action_finance_type = 'collectivite' THEN af.real_amount ELSE 0 END) as "depense_finance_collectivite",
            SUM(CASE WHEN af.fk_action_finance_type = 'europeen' THEN af.real_amount ELSE 0 END) as "depense_finance_europeen",
            SUM(CASE WHEN af.fk_action_finance_type = 'prive' THEN af.real_amount ELSE 0 END) as "depense_finance_prive",
            SUM(CASE WHEN af.fk_action_finance_type = 'autre' THEN af.real_amount ELSE 0 END) as "depense_finance_autre"
        FROM 
            action_finances af
        WHERE
            af."year" = :annee::integer
        GROUP BY
        1, 2
        ),
        metrics AS
        (
            WITH ranked_metrics AS (
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
                    action_metrics.created_at,
                    RANK() OVER(
                        PARTITION BY action_metrics.fk_action
                        ORDER BY date_trunc('seconds', action_metrics.created_at) DESC
                    ) AS rank
                FROM action_metrics
                WHERE
                TO_CHAR(action_metrics.date, 'YYYY') = :annee::varchar
            )
            SELECT *
                FROM ranked_metrics
                WHERE rank = 1
        ),
        scolarmetrics AS
        (
            WITH ranked_metrics AS (
                SELECT
                    action_metrics.fk_action AS action_id,
                    action_metrics.date,
                    action_metrics.scolaire_mineurs_scolarisables,
                    action_metrics.scolaire_mineurs_en_mediation,
                    action_metrics.scolaire_nombre_maternelle,
                    action_metrics.scolaire_nombre_elementaire,
                    action_metrics.scolaire_nombre_college,
                    action_metrics.scolaire_nombre_lycee,
                    action_metrics.scolaire_nombre_autre,
                    action_metrics.created_at,
                    RANK() OVER(
                        PARTITION BY action_metrics.fk_action
                        ORDER BY action_metrics.date DESC, date_trunc('seconds', action_metrics.created_at) DESC
                    ) AS rank
                FROM 
                action_metrics
                WHERE
                (
                    action_metrics.scolaire_mineurs_scolarisables IS NOT NULL OR
                    action_metrics.scolaire_mineurs_en_mediation IS NOT NULL OR
                    action_metrics.scolaire_nombre_maternelle IS NOT NULL OR
                    action_metrics.scolaire_nombre_elementaire IS NOT NULL OR
                    action_metrics.scolaire_nombre_college IS NOT NULL OR
                    action_metrics.scolaire_nombre_lycee IS NOT NULL OR
                    action_metrics.scolaire_nombre_autre IS NOT NULL
                )
                AND
                    action_metrics.date <= TO_DATE(:annee || '-09-01', 'YYYY-MM-DD') + INTERVAL '1 year'
                AND
                action_metrics.date > TO_DATE(:annee || '-12-31', 'YYYY-MM-DD') - INTERVAL '1 year'
            )
            SELECT *
            FROM ranked_metrics
            WHERE rank = 1
        ),
        actiontopics AS (
            SELECT
                fk_action,
                array_agg(name) AS topics
            FROM
                action_topics
            LEFT JOIN
                topics ON topics.uid = action_topics.fk_topic
            GROUP BY
                fk_action
        )
    SELECT
        d.code AS "departement_code",
        d.name AS "departement_name",
        r.code AS "region_code",
        r.name AS "region_name",
        actions.action_id,
        actions."name" AS "action_name",
        TO_CHAR(started_at, 'DD/MM/YYYY') AS "started_at",
        TO_CHAR(ended_at, 'DD/MM/YYYY') AS "ended_at",
        CASE actions.location_type
            WHEN 'eti' THEN 'Espace temporaire d''accompagnement'
            WHEN 'logement' THEN 'Dans le logement'
            WHEN 'sur_site' THEN 'Sur site'
            WHEN 'autre' THEN 'Autre (hébergement, permanence, rue)'
            ELSE 'Non communiqué'
        END AS "location_type",
        topics,
        actions.goals,
        m.nombre_personnes,
        m.nombre_menages,
        m.nombre_femmes,
        m.nombre_mineurs,
        m.sante_nombre_personnes,
        m.travail_nombre_personnes,
        m.travail_nombre_femmes,
        m.hebergement_nombre_personnes,
        m.hebergement_nombre_menages,
        m.logement_nombre_personnes,
        m.logement_nombre_menages,
        sm.scolaire_mineurs_scolarisables,
        sm.scolaire_mineurs_en_mediation,
        sm.scolaire_nombre_maternelle,
        sm.scolaire_nombre_elementaire,
        sm.scolaire_nombre_college,
        sm.scolaire_nombre_lycee,
        sm.scolaire_nombre_autre,
        fi.finance_etatique,
        fi.finance_dedie,
        fi.finance_collectivite,
        fi.finance_europeen,
        fi.finance_prive,
        fi.finance_autre,
        fi.depense_finance_etatique,
        fi.depense_finance_dedie,
        fi.depense_finance_collectivite,
        fi.depense_finance_europeen,
        fi.depense_finance_prive,
        fi.depense_finance_autre,
        cm.description AS "comments",
        cm2.description AS "last_comment",
        cm2.last_comment_date AS "last_comment_date",
        actions.updated_at AS "last_update"
    FROM 
        actions
    LEFT JOIN
        departements d ON d.code = actions.fk_departement 
    LEFT JOIN
        regions r ON r.code = d.fk_region 
    LEFT JOIN
        actiontopics at ON at.fk_action = actions.action_id
    LEFT JOIN
        metrics m ON m.action_id = actions.action_id 
    LEFT JOIN
        scolarmetrics sm ON sm.action_id = actions.action_id
    LEFT JOIN
        actioncomments cm ON cm.fk_action = actions.action_id
    LEFT JOIN
        last_comments cm2 ON cm2.fk_action = actions.action_id
    LEFT JOIN
        finances fi ON fi.action_id = actions.action_id
    WHERE
        actions.started_at <= TO_DATE(:annee::varchar || '-12-31', 'YYYY-MM-DD')
    AND
        (actions.ended_at IS NULL OR actions.ended_at >=  TO_DATE(:annee::varchar || '-01-01', 'YYYY-MM-DD'))
    ORDER BY
        actions.action_id ;`,
    {
        type: QueryTypes.SELECT,
        replacements: { annee: requestedYear },
    },
);
