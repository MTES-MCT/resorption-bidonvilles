import permissionUtils from '#server/utils/permission';
import Action from '#root/types/resources/Action.d';
import { User } from '#root/types/resources/User.d';

const { can } = permissionUtils;

export type ActionRow = {
    hid?: number,
    action_id: number,
    action_ref: string | null,
    name: string,
    started_at: string | Date,
    ended_at: string | Date | null,
    goals: string | null,
    departement_name: string,
    departement_code: string,
    region_name: string,
    region_code: string,
    location_type: string,
    address: string | null,
    latitude: number | null,
    longitude: number | null,
    eti_fk_city: string | null,
    location_other: string | null,
    creator_id: number,
    creator_first_name: string,
    creator_last_name: string,
    creator_organization_id: number,
    creator_organization_name: string,
    creator_organization_abbreviation: string | null,
    created_at: Date,
    editor_id: number | null,
    editor_first_name: string | null,
    editor_last_name: string | null,
    editor_organization_id: number | null,
    editor_organization_name: string | null,
    editor_organization_abbreviation: string | null,
    updated_at: Date,
    topics?: Array<{ uid: string, name: string }>,
    managers?: Array<any>,
    operators?: Array<any>,
    shantytowns?: Array<any>,
    finances?: { [key: number]: any[] },
    metrics?: Array<any>,
};

function fromDateToTimestamp(date: string | Date | null): number | null {
    if (date === null) {
        return null;
    }

    if (typeof date === 'string') {
        return new Date(date).getTime();
    }

    return date.getTime();
}

export default (action: ActionRow, user: User): Action => {
    const location = {
        type: 'departement' as const,
        city: null,
        epci: null,
        departement: {
            code: action.departement_code,
            name: action.departement_name,
        },
        region: {
            code: action.region_code,
            name: action.region_name,
        },
    };

    const serializedAction: Action = {
        type: 'action',
        id: action.action_id,
        displayId: action.action_ref || (() => {
            const createdYear = new Date(action.created_at).getFullYear();
            const paddedActionId = String(action.action_id).padStart(4, '0');
            return `ID${action.departement_code}${createdYear}${paddedActionId}`;
        })(),
        name: action.name,
        started_at: fromDateToTimestamp(action.started_at),
        ended_at: fromDateToTimestamp(action.ended_at),
        goals: action.goals,
        topics: action.topics || [],
        location,
        location_type: action.location_type as any,
        eti: action.location_type === 'eti' ? {
            address: action.address,
            latitude: action.latitude,
            longitude: action.longitude,
            citycode: action.eti_fk_city,
        } : null,
        location_other: action.location_other,
        location_shantytowns: action.shantytowns || [],
        managers: action.managers || [],
        operators: action.operators || [],
        metrics: action.metrics || [],
        metrics_updated_at: null,
        comments: [],
        created_at: action.created_at.getTime(),
        created_by: {
            id: action.creator_id,
            first_name: action.creator_first_name,
            last_name: action.creator_last_name,
            organization: {
                id: action.creator_organization_id,
                name: action.creator_organization_name,
                abbreviation: action.creator_organization_abbreviation,
            },
        },
        updated_at: action.updated_at?.getTime() || null,
        updated_by: action.editor_id !== null ? {
            id: action.editor_id,
            first_name: action.editor_first_name,
            last_name: action.editor_last_name,
            organization: {
                id: action.editor_organization_id,
                name: action.editor_organization_name,
                abbreviation: action.editor_organization_abbreviation,
            },
        } : null,
    };

    // Ajouter les finances uniquement si l'utilisateur a la permission
    if (can(user).do('access', 'action_finances').on(location)) {
        serializedAction.finances = action.finances || {};
    }

    return serializedAction;
};
