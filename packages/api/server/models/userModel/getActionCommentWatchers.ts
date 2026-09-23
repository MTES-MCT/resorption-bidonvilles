import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type ActionCommentWatcher = {
    email: string,
    first_name: string,
    last_name: string,
};

export default async function getActionCOmmentWatchers(commentId: number): Promise<ActionCommentWatcher[]> {
    return sequelize.query(
        `-- on regroupe les informations géographiques sur le commentaire, ses destinataires (s'il est privé), et les acteurs de l'action
        WITH constants AS (SELECT
            actions.fk_departement AS departement,
            departements.fk_region AS region,
            COUNT(acut.fk_user) + COUNT(acot.fk_organization) > 0 AS is_private,
            array_remove(array_agg(DISTINCT acut.fk_user), NULL) AS user_targets,
            array_remove(array_agg(DISTINCT acot.fk_organization), NULL) AS organization_targets,
            array_remove(array_agg(DISTINCT action_operators.fk_user), NULL)
                || array_remove(array_agg(DISTINCT action_managers.fk_user), NULL) AS actors
        FROM action_comments
        LEFT JOIN actions ON action_comments.fk_action = actions.action_id
        LEFT JOIN departements ON actions.fk_departement = departements.code
        LEFT JOIN action_operators ON action_operators.fk_action = actions.action_id
        LEFT JOIN action_managers ON action_managers.fk_action = actions.action_id
        LEFT JOIN action_comment_user_targets acut ON acut.fk_comment = action_comments.action_comment_id
        LEFT JOIN action_comment_organization_targets acot ON acot.fk_comment = action_comments.action_comment_id
        WHERE action_comments.action_comment_id = :commentId
        GROUP BY departement, region)

        SELECT
            users.email,
            users.first_name,
            users.last_name
        FROM (
            SELECT
                users.user_id
            FROM user_actual_permissions uap
            LEFT JOIN users ON uap.fk_user = users.user_id
            LEFT JOIN v_user_areas ON uap.fk_user = v_user_areas.user_id
            LEFT JOIN constants ON TRUE
            WHERE
                -- 1. l'utilisateur a la permission de voir les commentaires publics/privés
                uap.fk_feature = CASE WHEN constants.is_private THEN 'listPrivate' ELSE 'list' END
                AND uap.fk_entity = 'action_comment'
                AND uap.allowed IS TRUE

                -- 2. l'utilisateur a cette permission sur le bon territoire
                AND (
                    -- le même département/région que l'action, à condition d'être un utilisateur départemental/régional, un admin local,
                    -- ou un opérateur/pilote de l'action
                    -- (l'objectif de ces conditions est d'exclure les utilisateurs trop éloignés de l'action)
                    (
                        uap.fk_departement = constants.departement
                        AND (uap.type = 'departement' OR users.fk_role = 'local_admin' OR users.user_id = ANY(constants.actors))
                    )
                    OR (
                        uap.fk_region = constants.region
                        AND (uap.type = 'region' OR users.fk_role = 'local_admin' OR users.user_id = ANY(constants.actors))
                    )

                    -- permission nationale, à condition d'avoir le territoire de l'action dans ses territoires d'intervention
                    OR (uap.type = 'nation' AND
                        (
                        constants.departement = ANY(v_user_areas.departements)
                        OR constants.region = ANY(v_user_areas.regions)
                        )
                    )
                )

                -- 3. si le commentaire est privé, l'utilisateur est destinataire du commentaire
                -- note: même si l'utilisateur est destinataire du commentaire on contrôle ses permissions ci-dessus
                -- car ça n'a pas de sens de notifier un utilisateur qui n'a pas le droit de voir le commentaire
                AND (
                    constants.is_private IS FALSE
                    OR users.user_id = ANY(constants.user_targets)
                    OR users.fk_organization = ANY(constants.organization_targets)
                )
        ) t
        LEFT JOIN users ON t.user_id = users.user_id
        WHERE
            users.fk_status = 'active'
            AND t.user_id NOT IN (
                SELECT fk_user FROM user_email_unsubscriptions WHERE email_subscription = 'action_comment_notification'
        )`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                commentId,
            },
        },
    );
}
