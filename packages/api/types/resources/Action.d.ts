// import { Attachment } from '#server/services/attachment/Attachment.d';
import { CommentAuthor } from '#root/types/resources/CommentAuthor.d';
import ActionLocationType from './ActionLocationType.d';
import { ActionRawComment } from './ActionCommentRaw.d';
import { ActionEnrichedComment } from './ActionCommentEnriched.d';

export type ActionItem = {
    departement_name: string,
    region_code: string,
    region_name: string,
    action_id: number,
    action_name: string,
    started_at: string,
    ended_at: string | null,
    location_type: string,
    topics: string[],
    operators: string[],
    goals: string,
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
    finance_etatique: number | null,
    finance_dedie: number | null,
    finance_collectivite: number | null,
    finance_europeen: number | null,
    finance_prive: number | null,
    finance_autre: number | null,
    depense_finance_etatique: number | null,
    depense_finance_dedie: number | null,
    depense_finance_collectivite: number | null,
    depense_finance_europeen: number | null,
    depense_finance_prive: number | null,
    depense_finance_autre: number | null,
    comments: string | null,
    last_comment: string | null,
    last_comment_date: string | null,
    last_update: string | null,
    metrics_updated_at: string | null,
};

export type ActionReportRow = {
    departement_code: string,
} & ActionItem;


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
export type Comment = {
    id: number,
    description: string,
    createdAt: number,
    createdBy: CommentAuthor,
    attachments: string[]
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
        id: number,
        name: string,
        abbreviation: string,
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
    shantytowns: number[],
    is_ended: boolean,
}

interface GenericAction extends IAction {
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
    metrics_updated_at: number | null,
    finances?: ActionFinances,
    created_at: number,
    created_by: ActionUser,
    updated_at: number | null,
    updated_by: ActionUser | null,
}

interface Action extends GenericAction {
    comments: ActionRawComment[],
}

export interface EnrichedAction extends GenericAction {
    comments: ActionEnrichedComment[],
}

export type FinancedShantytownAction = {
    shantytown_id: number,
    hasAtLeastOneActionFinanced: boolean,
};

export default Action;
