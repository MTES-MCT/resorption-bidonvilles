import { permissionOption } from '#server/models/permissionModel/types/permissionOption';
import { Permissions } from '#server/models/permissionModel/types/Permissions';
import { userStatus } from './userStatus';
import type { UserAccess } from './UserAccess';
import { userLocationType } from './userLocationType';

export interface User {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone: string | null,
    position: string,
    status: userStatus,
    created_at: number,
    user_accesses: UserAccess[],
    organization: {
        id: number,
        name: string,
        abbreviation: string | null,
        active: boolean,
        type: {
            id: string,
            uid: string,
            name_singular: string,
            name_plural: string,
            abbreviation: string | null
        },
        category: {
            uid: string,
            name_singular: string,
            name_plural: string
        },
        location: {
            type: userLocationType,
            latitude: number,
            longitude: number,
            region: {
                code: string,
                name: string
            } | null,
            departement: {
                code: string,
                name: string
            } | null,
            epci: {
                code: string,
                name: string
            } | null,
            city: {
                code: string,
                name: string
            } | null
        }
    },
    charte_engagement_a_jour: boolean,
    is_admin: boolean,
    role: string,
    role_id: string,
    is_superuser: boolean,

    // filter: auth
    password: string | undefined,
    salt: string | undefined,

    // filter: extended
    access_request_message: string | undefined,
    default_export: Array<string> | undefined,
    permissions: Permissions | undefined,
    permission_options: Array<permissionOption> | undefined,

    // filter: app
    last_version: string | null | undefined,
    last_changelog: string | null | undefined
}
