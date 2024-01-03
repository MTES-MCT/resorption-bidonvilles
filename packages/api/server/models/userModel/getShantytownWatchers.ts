import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type ShantytownWatcher = {
    email: string,
    first_name: string,
    last_name: string,
};

export default async (commentId: number): Promise<ShantytownWatcher[]> => sequelize.query(
    `-- on regroupe les informations géographiques sur le commentaire, ses destinataires (s'il est privé), et les acteurs du site
    WITH constants AS (SELECT
        cities.code AS city,
        cities.fk_epci AS epci,
        cities.fk_departement AS departement,
        departements.fk_region AS region,
        COUNT(scut.fk_user) + COUNT(scot.fk_organization) > 0 AS is_private,
        array_remove(array_agg(DISTINCT scut.fk_user), NULL) AS user_targets,
        array_remove(array_agg(DISTINCT scot.fk_organization), NULL) AS organization_targets,
        array_remove(array_agg(DISTINCT shantytown_actors.fk_user), NULL) AS actors
    FROM shantytown_comments
    LEFT JOIN shantytowns ON shantytown_comments.fk_shantytown = shantytowns.shantytown_id
    LEFT JOIN cities ON shantytowns.fk_city = cities.code
    LEFT JOIN departements ON cities.fk_departement = departements.code
    LEFT JOIN shantytown_actors ON shantytown_actors.fk_shantytown = shantytowns.shantytown_id
    LEFT JOIN shantytown_comment_user_targets scut ON scut.fk_comment = shantytown_comments.shantytown_comment_id
    LEFT JOIN shantytown_comment_organization_targets scot ON scot.fk_comment = shantytown_comments.shantytown_comment_id
    WHERE shantytown_comments.shantytown_comment_id = :commentId
    GROUP BY city, epci, departement, region)

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
            AND uap.fk_entity = 'shantytown_comment'
            AND uap.allowed IS TRUE

            -- 2. l'utilisateur a cette permission sur le bon territoire
            AND (
                -- la même ville que le site
                uap.fk_city = constants.city

                -- le même epci que le site
                OR uap.fk_epci = constants.epci

                -- le même département/région que le site, à condition d'être un utilisateur départemental/régional, un admin local,
                -- ou un intervenant du site
                -- (l'objectif de ces conditions est d'exclure les utilisateurs en commune ou epci qui sont certes sur le même
                -- département/région que le site, mais sont trop éloignés du site pour être concernés)
                OR (
                    uap.fk_departement = constants.departement
                    AND (uap.type = 'departement' OR users.fk_role = 'local_admin' OR users.user_id = ANY(constants.actors))
                )
                OR (
                    uap.fk_region = constants.region
                    AND (uap.type = 'region' OR users.fk_role = 'local_admin' OR users.user_id = ANY(constants.actors))
                )

                -- permission nationale, à condition d'avoir le territoire du site dans ses territoires d'intervention
                OR (uap.type = 'nation' AND
                    (
                    constants.city = ANY(v_user_areas.cities)
                    OR constants.epci = ANY(v_user_areas.epci)
                    OR constants.departement = ANY(v_user_areas.departements)
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
            SELECT fk_user FROM user_email_unsubscriptions WHERE email_subscription = 'comment_notification'
        )`,
    {
        type: QueryTypes.SELECT,
        replacements: {
            commentId,
        },
    },
);
