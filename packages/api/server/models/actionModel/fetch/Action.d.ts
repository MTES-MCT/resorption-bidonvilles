import { File } from '#types/resources/File.d';
import ActionLocationType from './ActionLocationType.d';

type ActionUser = {
    id: number,
    first_name: string,
    last_name: string,
    organization: {
        id: number,
        name: string,
        abbreviation: string | null
    },
};
export type ActionShantytown = {
    id: number,
    address: string,
    name: string | null,
    closed_at: number | null,
    usename: string,
    fieldType: {
        id: number,
        label: string,
    },
    city: {
        name: string,
    }
};
type ActionTopic = {
    uid: string,
    name: string
};
type CommentAuthor = {
    id: number,
    first_name: string,
    last_name: string,
    organization_id: number,
    organization: string,
};
export type Comment = {
    id: number,
    description: string,
    tags: [],
    user_target_name: [],
    organization_target_name: [],
    createdAt: number,
    createdBy: CommentAuthor,
    attachments: File[]
};
type ActionMetrics = {
    date: number,
    nombre_personnes: number | null,
    nombre_menages: number | null,
    nombre_femmes: number | null,
    nombre_mineurs: number | null,
    sante_nombre_personnes: number | null,
    travail_nombre_personnes: number | null,
    travail_nombre_femmes: number | null,
    hebergement_nombre_personnes: number | null,
    hebergement_nombre_menages: number | null,
    logement_nombre_personnes: number | null,
    logement_nombre_menages: number | null,
    scolaire_mineurs_scolarisables: number | null,
    scolaire_mineurs_en_mediation: number | null,
    scolaire_nombre_maternelle: number | null,
    scolaire_nombre_elementaire: number | null,
    scolaire_nombre_college: number | null,
    scolaire_nombre_lycee: number | null,
    scolaire_nombre_autre: number | null,
    created_at: number,
    created_by: ActionUser,
};
export type ActionOrganizationMember = {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    position: string,
    phone: string | null,
    role: string,
    is_admin: boolean,
    organization: {
        id: number
    }
};
type ActionOrganization = {
    id: number,
    name: string,
    abbreviation: string | null,
    users: ActionOrganizationMember[]
};
type ActionFinances = {
    [key: number]: ActionFinanceRow[],
};
type ActionFinanceRow = {
    type: {
        uid: string,
        name: string,
    },
    amount: number,
    real_amount: number | null,
    comments: string,
};

interface IAction {
    id: number,
    name: string,
    topics: ActionTopic[],
    operators: ActionOrganization[],
    location: {
        type: 'departement',
        city: null,
        epci: null,
        departement: {
            code: string,
            name: string
        },
        region: {
            code: string,
            name: string,
        }
    }
}

export interface ShantytownAction extends IAction {
    shantytowns: number[]
}

interface Action extends IAction {
    type: 'action',
    started_at: number,
    ended_at: number | null,
    goals: string | null,
    location_type: ActionLocationType,
    eti: {
        address: string,
        latitude: number,
        longitude: number,
        citycode: string,
    } | null,
    location_other: string | null,
    location_shantytowns: ActionShantytown[] | null,
    managers: ActionOrganization[],
    metrics: ActionMetrics[],
    finances?: ActionFinances,
    comments: Comment[],
    created_at: number,
    created_by: ActionUser,
    updated_at: number | null,
    updated_by: ActionUser | null,
}

export default Action;
