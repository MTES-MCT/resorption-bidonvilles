import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { RolePermissionList } from '#root/types/resources/Permission.d';

type RolePermission = {
    role: string;
    feature: string;
    entity: string;
    allowed: boolean;
    allow_all: boolean;
};

export default async (): Promise<RolePermissionList> => {
    const rows: RolePermission[] = await sequelize.query(
        `SELECT
            COALESCE(fk_role_regular, fk_role_admin) AS role,
            fk_feature AS feature,
            fk_entity AS entity,
            allowed,
            allow_all
        FROM role_permissions
        ORDER BY fk_role_regular ASC, fk_role_admin ASC, fk_entity ASC, allowed ASC`,
        {
            type: QueryTypes.SELECT,
        },
    );

    return rows.reduce((acc, row) => {
        if (!acc[row.role]) {
            acc[row.role] = [];
        }

        acc[row.role].push({
            feature: row.feature,
            entity: row.entity,
            allowed: row.allowed,
            allow_all: row.allow_all,
        });
        return acc;
    }, {} as RolePermissionList);
};
