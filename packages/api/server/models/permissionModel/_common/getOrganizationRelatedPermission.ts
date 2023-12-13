import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';

type SimplePermission = {
    allow_all: boolean,
    allowed: boolean,
};
type SimpleUserPermission = SimplePermission & {
    user_permission_id: number,
};
type OrganizationPermissionRow = {
    user_permission_id: number,
    allow_all: boolean,
    allowed: boolean,
    role_allow_all: boolean,
    role_allowed: boolean,
};

export default async (feature: string, entity: string, organizationId: number, transaction: Transaction = undefined): Promise<[SimpleUserPermission, SimplePermission]> => {
    const rows: OrganizationPermissionRow[] = await sequelize.query(
        `SELECT
            upo.user_permission_id,
            upo.allow_all AS allow_all,
            upo.allowed AS allowed,
            rp.allow_all AS role_allow_all,
            rp.allowed AS role_allowed
        FROM organizations o
        LEFT JOIN organization_types ot ON o.fk_type = ot.organization_type_id
        LEFT JOIN user_permissions upo ON (upo.fk_organization = o.organization_id AND upo.fk_feature = :feature AND upo.fk_entity = :entity)
        LEFT JOIN role_permissions rp ON (rp.fk_role_regular = ot.fk_role AND rp.fk_feature = :feature AND rp.fk_entity = :entity)
        WHERE o.organization_id = :organizationId`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                feature,
                entity,
                organizationId,
            },
            transaction,
        },
    );

    if (rows.length === 0) {
        return [null, null];
    }

    const {
        user_permission_id, allow_all, allowed, role_allow_all, role_allowed,
    } = rows[0];

    let userPermission: SimpleUserPermission = null;
    if (user_permission_id !== null) {
        userPermission = {
            user_permission_id,
            allow_all,
            allowed,
        };
    }

    let defaultPermission: SimplePermission = null;
    if (role_allowed !== null) {
        defaultPermission = {
            allowed: role_allowed,
            allow_all: role_allow_all,
        };
    }

    return [userPermission, defaultPermission];
};
