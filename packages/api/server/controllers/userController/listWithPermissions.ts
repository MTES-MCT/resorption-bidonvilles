import { NextFunction, Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.status(200).send({
            users: await sequelize.query(
                `WITH grouped_attachments AS (
                    SELECT
                        upa.fk_user_permission,
                        array_remove(array_agg(upa.fk_region), null) AS regions,
                        array_remove(array_agg(upa.fk_departement), null) AS departements,
                        array_remove(array_agg(upa.fk_epci), null) AS epci,
                        array_remove(array_agg(upa.fk_city), null) AS cities,
                        array_remove(array_agg(upa.fk_plan), null) AS plans,
                        array_remove(array_agg(upa.fk_action), null) AS actions
                    FROM user_permission_attachments upa
                    GROUP BY upa.fk_user_permission
                )
                
                SELECT
                    *
                FROM user_permissions
                LEFT JOIN users u ON u.user_id = user_permissions.fk_user
                LEFT JOIN grouped_attachments ga ON ga.fk_user_permission = user_permissions.user_permission_id
                WHERE user_permissions.fk_user IS NOT NULL
                
                ORDER BY u.user_id ASC`,
                {
                    type: QueryTypes.SELECT,
                },
            ),
            organizations: await sequelize.query(
                `WITH grouped_attachments AS (
                    SELECT
                        upa.fk_user_permission,
                        array_remove(array_agg(upa.fk_region), null) AS regions,
                        array_remove(array_agg(upa.fk_departement), null) AS departements,
                        array_remove(array_agg(upa.fk_epci), null) AS epci,
                        array_remove(array_agg(upa.fk_city), null) AS cities,
                        array_remove(array_agg(upa.fk_plan), null) AS plans,
                        array_remove(array_agg(upa.fk_action), null) AS actions
                    FROM user_permission_attachments upa
                    GROUP BY upa.fk_user_permission
                ),
                organizations_with_active_users AS (
                    SELECT
                        o.organization_id,
                        COUNT(u.user_id) AS count
                    FROM users u
                    LEFT JOIN organizations o ON u.fk_organization = o.organization_id
                    WHERE u.fk_status = 'active'
                    GROUP BY o.organization_id
                )

                SELECT
                    *
                FROM user_permissions
                LEFT JOIN organizations o ON o.organization_id = user_permissions.fk_organization
                LEFT JOIN organizations_with_active_users owau ON owau.organization_id = o.organization_id
                LEFT JOIN grouped_attachments ga ON ga.fk_user_permission = user_permissions.user_permission_id
                WHERE user_permissions.fk_organization IS NOT NULL
                ORDER BY o.organization_id ASC`,
                {
                    type: QueryTypes.SELECT,
                },
            ),
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
        next(error);
    }
};
