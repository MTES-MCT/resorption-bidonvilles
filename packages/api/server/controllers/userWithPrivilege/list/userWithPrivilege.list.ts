import { NextFunction, Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';
import { User } from '#root/types/resources/User.d';

interface ListUserWithPrivilegeRequest extends Request {
    user: User
}

export default async (req: ListUserWithPrivilegeRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user.is_superuser) {
        res.status(400).send({
            user_message: 'Vous n\'avez pas les permissions pour accéder à cette route',
        });
        return;
    }

    try {
        res.status(200).send({
            users: await sequelize.query(
                `SELECT
                    permissions.fk_feature,
                    permissions.fk_entity,
                    permissions.allowed,
                    u.user_id,
                    u.first_name,
                    u.last_name,
                    u.email,
                    u.fk_organization,
                    u.fk_status,
                    COUNT(CASE WHEN permissions.type = 'nation' THEN 1 ELSE NULL END) > 0 AS is_national,
                    array_remove(array_agg(permissions.fk_region), null) AS regions,
                    array_remove(array_agg(permissions.fk_departement), null) AS departements,
                    array_remove(array_agg(permissions.fk_epci), null) AS epci,
                    array_remove(array_agg(permissions.fk_city), null) AS cities
                FROM permissions
                LEFT JOIN users u ON u.user_id = permissions.fk_user
                WHERE permissions.fk_user IS NOT NULL
                GROUP BY permissions.fk_feature, permissions.fk_entity, permissions.allowed, u.user_id, u.first_name, u.last_name, u.email, u.fk_organization, u.fk_status
                ORDER BY u.user_id ASC`,
                {
                    type: QueryTypes.SELECT,
                },
            ),
            organizations: await sequelize.query(
                `WITH organizations_with_active_users AS (
                    SELECT
                        o.organization_id,
                        COUNT(u.user_id) AS count
                    FROM users u
                    LEFT JOIN organizations o ON u.fk_organization = o.organization_id
                    WHERE u.fk_status = 'active'
                    GROUP BY o.organization_id
                )

                SELECT
                    permissions.fk_feature,
                    permissions.fk_entity,
                    permissions.allowed,
                    o.organization_id,
                    o.name,
                    o.abbreviation,
                    owau.count,
                    COUNT(CASE WHEN permissions.type = 'nation' THEN 1 ELSE NULL END) > 0 AS is_national,
                    array_remove(array_agg(permissions.fk_region), null) AS regions,
                    array_remove(array_agg(permissions.fk_departement), null) AS departements,
                    array_remove(array_agg(permissions.fk_epci), null) AS epci,
                    array_remove(array_agg(permissions.fk_city), null) AS cities
                FROM permissions
                LEFT JOIN organizations o ON o.organization_id = permissions.fk_organization
                LEFT JOIN organizations_with_active_users owau ON owau.organization_id = o.organization_id
                WHERE permissions.fk_organization IS NOT NULL
                GROUP BY permissions.fk_feature, permissions.fk_entity, permissions.allowed, o.organization_id, o.name, o.abbreviation, owau.count
                ORDER BY o.organization_id ASC`,
                {
                    type: QueryTypes.SELECT,
                },
            ),
        });
    } catch (error) {
        res.status(500).send({ user_message: error.message });
        next(error);
    }
};
