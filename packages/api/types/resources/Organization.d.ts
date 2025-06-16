import { InterventionArea } from '#server/models/geoModel/Location.d';
import { UserExpertiseTopic } from '#root/types/resources/User.d';

export type Organization = {
    id: number,
    name: string,
    abbreviation: string | null,
    being_funded: boolean,
    being_funded_at: Date,
    intervention_areas: {
        is_national: boolean,
        areas: InterventionArea[]
    },
    type: {
        id: number,
        category: string,
        name: string,
        abbreviation: string | null,
    },
    users: OrganizationUser[],
};

export type OrganizationUser = {
    id: number,
    is_admin: boolean,
    role: string,
    first_name: string,
    last_name: string,
    email: string,
    phone: string | null,
    position: string,
    expertise_topics: UserExpertiseTopic[],
    status: string,
};
