import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (shantytownId, commentId, isPrivate) => {
    if (isPrivate) {
        return sequelize.query(
            `WITH constants(departement) AS
                (
                    SELECT cities.fk_departement AS departement
                    FROM shantytowns
                    LEFT JOIN cities ON shantytowns.fk_city = cities.code
                    WHERE shantytowns.shantytown_id = :shantytownId
                )
                SELECT
                    u.email,
                    u.first_name,
                    u.last_name
                FROM
                (
                    (
                        SELECT scut.fk_user
                        FROM shantytown_comment_user_targets scut
                        WHERE scut.fk_comment = :commentId
                    )
                    UNION
                    (
                        SELECT u.user_id AS fk_user
                        FROM users u
                        LEFT JOIN localized_organizations lo ON u.fk_organization = lo.organization_id
                        LEFT JOIN shantytown_comment_organization_targets scot ON scot.fk_organization = lo.organization_id
                        WHERE scot.fk_comment = :commentId
                    )
                    UNION
                    (
                        SELECT u.user_id AS fk_user
                        FROM users u
                        LEFT JOIN constants ON TRUE
                        LEFT JOIN localized_organizations lo ON u.fk_organization = lo.organization_id
                        LEFT JOIN user_actual_permissions up ON u.user_id = up.user_id
                        WHERE up.feature = 'listPrivate'
                        AND up.entity = 'shantytown_comment'
                        AND up.allowed IS TRUE
                        AND lo.departement_code = constants.departement
                    )
                ) t
                LEFT JOIN users u ON t.fk_user = u.user_id
                LEFT JOIN localized_organizations lo ON u.fk_organization = lo.organization_id
                WHERE u.fk_status = 'active'
                AND lo.active IS TRUE
                AND t.fk_user NOT IN 
                (
                    SELECT fk_user
                    FROM user_email_unsubscriptions
                    WHERE email_subscription = 'comment_notification'
                )`,
            {
                type: QueryTypes.SELECT,
                replacements: {
                    shantytownId,
                    commentId,
                },
            },
        );
    }
    return sequelize.query(
        `WITH constants(departement, epci, city) AS
        (
            SELECT 
                cities.fk_departement AS departement,
                cities.fk_epci AS epci,
                cities.code AS city
            FROM shantytowns
            LEFT JOIN cities ON shantytowns.fk_city = cities.code
            WHERE shantytowns.shantytown_id = :shantytownId
        )
        SELECT
            u.email,
            u.first_name,
            u.last_name
        FROM
        (
            (
                SELECT sw.fk_user
                FROM shantytown_watchers sw
                WHERE sw.fk_shantytown = :shantytownId
            )
            UNION
            (
                SELECT u.user_id AS fk_user
                FROM users u
                LEFT JOIN constants ON TRUE
                LEFT JOIN localized_organizations lo ON u.fk_organization = lo.organization_id
                WHERE lo.departement_code = constants.departement
                AND (lo.location_type != 'city' OR lo.city_code = constants.city )
                AND (lo.location_type != 'epci' OR lo.epci_code = constants.epci )
                AND lo.active IS TRUE
            )
        ) t
        LEFT JOIN users u ON t.fk_user = u.user_id
        WHERE u.fk_status = 'active'
        AND t.fk_user NOT IN 
        (
            SELECT fk_user
            FROM user_email_unsubscriptions
            WHERE email_subscription = 'comment_notification'
        )`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                shantytownId,
                commentId,
            },
        },
    );
};
