import { PermissionOption } from '#server/models/permissionModel/types/PermissionOption.d';
import { Permissions } from '#server/models/permissionModel/types/Permissions.d';
import { InterventionArea } from '#server/models/geoModel/Location.d';
import { ExpertiseTopic } from '#root/types/resources/ExpertiseTopic.d';

export type UserQuestionSubscriptions = {
    [key: number]: boolean
};

export type UserStatus = 'new' | 'active' | 'inactive';

export type UserAccess = {
    id: number,
    sent_by: {
        id: number,
        email: string,
        first_name: string,
        last_name: string,
        position: string | null,
        organization: {
            id: number,
            name: string,
        },
    } | null,
    used_at: number | null,
    expires_at: number,
    created_at: number,
    refused_at: number | null,
};

export type UserExpertiseTopicType = 'expertise' | 'interest';
export type UserExpertiseTopic = ExpertiseTopic & {
    type: UserExpertiseTopicType;
};

export type User = {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone: string | null,
    position: string | null,
    status: UserStatus,
    created_at: number,
    user_accesses: UserAccess[],
    organization: {
        id: number,
        name: string,
        abbreviation: string | null,
        active: boolean,
        type: {
            id: number,
            uid: string,
            name_singular: string,
            name_plural: string,
            abbreviation: string | null,
        },
        category: {
            uid: string,
            name_singular: string,
            name_plural: string,
        }
    },
    intervention_areas: {
        is_national: boolean,
        areas: InterventionArea[],
    },
    charte_engagement_a_jour: boolean,
    email_subscriptions: string[],
    question_subscriptions: UserQuestionSubscriptions,
    last_access: number | null,
    admin_comments: string | null,
    is_admin: boolean,
    role: string,
    role_id: string,
    is_superuser: boolean,
    expertise_topics_chosen: boolean,
    expertise_comment: string,
    expertise_topics: UserExpertiseTopic[],
    password_conformity?: boolean | null,

    // filter: auth
    password?: string,
    salt?: string,

    // filter: extended
    access_request_message?: string,
    permissions?: Permissions,
    permission_options?: Array<PermissionOption>,

    // filter: app
    last_version?: string | null,
    last_changelog?: string | null

    // anonymisation
    anonymized?: boolean | null,
    anonymized_at?: number | null,
    anonymization_requested: boolean | null,
};
