import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { Permissions } from './types/Permissions';
import { Permission } from './types/Permission';

type PermissionRow = {
    user_id: number,
    entity: string,
    feature: string,
    is_writing: boolean,
    allowed: boolean,
    allow_all: boolean | null,
    regions: string[] | null,
    departements: string[] | null,
    epci: string[] | null,
    cities: string[] | null,
    shantytowns: number[] | null,
    actions: number[] | null
};

type PermissionHash = {
    [key: number]: Permissions
};

export default async (owners: number[]): Promise<PermissionHash> => {
    const permissions: PermissionRow[] = await sequelize.query(`
        SELECT
            uap.user_id,
            uap.entity,
            uap.feature,
            uap.is_writing,
            uap.allowed,
            uap.allow_all,
            uap.regions,
            uap.departements,
            uap.epci,
            uap.cities,
            uap.shantytowns,
            uap.actions
        FROM user_actual_permissions uap
        WHERE uap.user_id IN (:owners)
        ORDER BY user_id ASC, entity ASC, feature ASC
    `, {
        type: QueryTypes.SELECT,
        replacements: {
            owners,
        },
    });

    return permissions.reduce((acc, row) => {
        if (!acc[row.user_id]) {
            acc[row.user_id] = {};
        }

        if (!acc[row.user_id][row.entity]) {
            acc[row.user_id][row.entity] = {};
        }

        const permission: Permission = {
            is_writing: row.is_writing,
            allowed: row.allowed,
            allow_all: row.allow_all === true,
            allowed_on: row.allow_all === false ? {
                regions: row.regions || [],
                departements: row.departements || [],
                epci: row.epci || [],
                cities: row.cities || [],
                shantytowns: row.shantytowns || [],
                actions: row.actions || [],
            } : null,
        };

        acc[row.user_id][row.entity][row.feature] = permission;
        return acc;
    }, {} as PermissionHash);
};
