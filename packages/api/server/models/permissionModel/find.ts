import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { Permissions } from './types/Permissions.d';
import { LocationType } from '../geoModel/LocationType';

type AuthorizedActionRow = {
    type: 'manager' | 'operator',
    fk_user: number,
    action_ids: number[],
};

type PermissionRow = {
    fk_user: number,
    fk_entity: string,
    fk_feature: string,
    allowed: boolean,
    type: LocationType,
    fk_region: string | null,
    region_code: string | null,
    region_name: string | null,
    fk_departement: string | null,
    departement_code: string | null,
    departement_name: string | null,
    fk_epci: string | null,
    epci_code: string | null,
    epci_name: string | null,
    fk_city: string | null,
    city_code: string | null,
    city_name: string | null,
    city_main: string | null,
};

export type PermissionHash = {
    [key: number]: Permissions
};

const plurals = {
    region: 'regions',
    departement: 'departements',
    epci: 'epci',
    city: 'cities',
};

function addPermissionForActions(hash: PermissionHash, userId: number, entity: string, feature: string, actionIds: number[]): void {
    /* eslint-disable no-param-reassign */
    if (!hash[userId]) {
        return;
    }

    if (!hash[userId][entity]) {
        hash[userId][entity] = {};
    }

    if (!hash[userId][entity][feature]) {
        hash[userId][entity][feature] = {
            allowed: true,
            allowed_on_national: false,
            allowed_on: {
                regions: [],
                departements: [],
                epci: [],
                cities: [],
                actions: [],
            },
        };
    }

    if (hash[userId][entity][feature].allowed === false) {
        hash[userId][entity][feature].allowed = true;
        hash[userId][entity][feature].allowed_on = {
            regions: [],
            departements: [],
            epci: [],
            cities: [],
            actions: [],
        };
    }

    if (hash[userId][entity][feature].allowed_on_national === false) {
        hash[userId][entity][feature].allowed_on.actions.push(...actionIds);
    }
    /* eslint-enable no-param-reassign */
}

export default async (owners: number[]): Promise<PermissionHash> => {
    const [authorizedActions, permissions] = await Promise.all([
        sequelize.query(`
            SELECT
                'manager' AS type,
                managers.user_id AS fk_user,
                array_remove(array_agg(action_managers.fk_action), null) AS action_ids
            FROM action_managers
            LEFT JOIN users ON action_managers.fk_user = users.user_id
            LEFT JOIN users AS managers ON managers.fk_organization = users.fk_organization
            WHERE managers.user_id IN (:owners)
            GROUP BY managers.user_id

            UNION

            SELECT
                'operator' AS type,
                operators.user_id AS fk_user,
                array_remove(array_agg(action_operators.fk_action), null) AS action_ids
            FROM action_operators
            LEFT JOIN users ON action_operators.fk_user = users.user_id
            LEFT JOIN users AS operators ON operators.fk_organization = users.fk_organization
            WHERE operators.user_id IN (:owners)
            GROUP BY operators.user_id
        `, {
            type: QueryTypes.SELECT,
            replacements: {
                owners,
            },
        }) as Promise<AuthorizedActionRow[]>,
        sequelize.query(`
            SELECT
                user_actual_permissions.fk_user,
                user_actual_permissions.fk_entity,
                user_actual_permissions.fk_feature,
                user_actual_permissions.allowed,
                user_actual_permissions.type,
                user_actual_permissions.fk_region,
                regions.code AS region_code,
                regions.name AS region_name,
                user_actual_permissions.fk_departement,
                departements.code AS departement_code,
                departements.name AS departement_name,
                user_actual_permissions.fk_epci,
                epci.code AS epci_code,
                epci.name AS epci_name,
                user_actual_permissions.fk_city,
                cities.code AS city_code,
                cities.name AS city_name,
                cities.fk_main AS city_main
            FROM user_actual_permissions
            LEFT JOIN cities ON cities.code = user_actual_permissions.fk_city
            LEFT JOIN epci ON epci.code = COALESCE(user_actual_permissions.fk_epci, cities.fk_epci)
            LEFT JOIN epci_to_departement ON epci_to_departement.fk_epci = epci.code
            LEFT JOIN departements ON departements.code = COALESCE(user_actual_permissions.fk_departement, epci_to_departement.fk_departement, cities.fk_departement)
            LEFT JOIN regions ON regions.code = COALESCE(user_actual_permissions.fk_region, departements.fk_region)
            WHERE user_actual_permissions.fk_user IN (:owners)
            ORDER BY user_actual_permissions.fk_user ASC, fk_entity ASC, fk_feature ASC
        `, {
            type: QueryTypes.SELECT,
            replacements: {
                owners,
            },
        }) as Promise<PermissionRow[]>,
    ]);

    const hashedPermissions = permissions.reduce((acc, row) => {
        if (!acc[row.fk_user]) {
            acc[row.fk_user] = {};
        }

        if (!acc[row.fk_user][row.fk_entity]) {
            acc[row.fk_user][row.fk_entity] = {};
        }

        if (!acc[row.fk_user][row.fk_entity][row.fk_feature]) {
            acc[row.fk_user][row.fk_entity][row.fk_feature] = {
                allowed: row.allowed,
                allowed_on_national: false,
                allowed_on: {
                    regions: [],
                    departements: [],
                    epci: [],
                    cities: [],
                    actions: [],
                },
            };
        }

        const permission = acc[row.fk_user][row.fk_entity][row.fk_feature];
        if (row.allowed === false) {
            permission.allowed = false;
            permission.allowed_on_national = false;
            permission.allowed_on = null;
        } else if (permission.allowed === true) {
            if (row.type === 'nation') {
                permission.allowed_on_national = true;
                permission.allowed_on = null;
            } else if (permission.allowed_on_national !== true) {
                permission.allowed_on[plurals[row.type]].push({
                    type: row.type,
                    region: row.region_code ? { code: row.region_code, name: row.region_name } : null,
                    departement: row.departement_code ? { code: row.departement_code, name: row.departement_name } : null,
                    epci: row.epci_code ? { code: row.epci_code, name: row.epci_name } : null,
                    city: row.city_code ? { code: row.city_code, name: row.city_name, main: row.city_main } : null,
                });
            }
        }

        return acc;
    }, {} as PermissionHash);

    // on crée, si nécessaire des permissions pour les actions
    // si les permissions existent déjà, on se contente d'ajouter les actions concernées dans allowed_on
    authorizedActions.forEach((row) => {
        addPermissionForActions(hashedPermissions, row.fk_user, 'action', 'read', row.action_ids);
        addPermissionForActions(hashedPermissions, row.fk_user, 'action', 'update', row.action_ids);
        addPermissionForActions(hashedPermissions, row.fk_user, 'action_comment', 'read', row.action_ids);
        addPermissionForActions(hashedPermissions, row.fk_user, 'action_comment', 'create', row.action_ids);

        // pour un pilote, on ajouter les droits d'accès aux financements
        if (row.type === 'manager') {
            addPermissionForActions(hashedPermissions, row.fk_user, 'action_finances', 'access', row.action_ids);
        }
    });

    return hashedPermissions;
};
