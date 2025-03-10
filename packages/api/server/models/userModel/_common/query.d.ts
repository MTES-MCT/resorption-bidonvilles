import { LocationType } from '#server/models/geoModel/LocationType.d';
import { UserStatus, UserExpertiseTopicType } from '#root/types/resources/User.d';

export type UserQueryFilters = {
    auth?: boolean,
    extended?: boolean,
    app?: boolean
};

export type RawExpertiseTopic = `${string},${string},${UserExpertiseTopicType}`;
export type RawEmailSubscription = `${string},${boolean}`;

export type RawUserAccess = {
    fk_user: number,
    user_access_id: number,
    user_access_used_at: Date | null,
    user_access_expires_at: Date,
    user_access_created_at: Date,
    user_access_refused_at: Date | null,
    activator_id: number | null,
    activator_email: string | null,
    activator_first_name: string | null,
    activator_last_name: string | null,
    activator_position: string | null,
    activator_organization_id: number | null,
    activator_organization_name: string | null
};

export type RawUser = {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    phone: string | null,
    position: string | null,
    password: string | null,
    password_conformity: boolean | null,
    salt: string,
    access_request_message: string | null,
    status: UserStatus,
    created_at: Date,
    last_version: string | null,
    last_changelog: string | null,
    charte_engagement_signee: number,
    expertise_topics_chosen: boolean,
    expertise_comment: string | null,
    topics: RawExpertiseTopic[],
    email_unsubscriptions: string[],
    question_subscriptions: RawEmailSubscription[],
    last_access: Date | null,
    admin_comments: string | null,
    is_national: boolean,
    use_custom_intervention_area: boolean,
    is_admin: boolean,
    user_role_admin: string | null,
    user_role_admin_name: string | null,
    organization_id: number,
    organization_name: string,
    organization_abbreviation: string | null,
    organization_active: boolean,
    organization_type_id: number,
    organization_type_uid: string,
    organization_type_name_singular: string,
    organization_type_name_plural: string,
    organization_type_abbreviation: string | null,
    user_role_regular: string,
    user_role_regular_name: string,
    organization_category_id: string,
    organization_category_name_singular: string,
    organization_category_name_plural: string,
    permission_options: string[],
    user_accesses: RawUserAccess[],
    anonymized: boolean | null,
    anonymized_at: Date | null,
    anonymization_requested: boolean | null,
};

export type RawInterventionArea = {
    fk_user: number,
    fk_organization: number,
    type: LocationType,
    is_main_area: boolean,
    region_code: string | null,
    region_name: string | null,
    departement_code: string | null,
    departement_name: string | null,
    epci_code: string | null,
    epci_name: string | null,
    city_code: string | null,
    city_name: string | null,
    city_main: string | null,
    latitude: number,
    longitude: number,
};
