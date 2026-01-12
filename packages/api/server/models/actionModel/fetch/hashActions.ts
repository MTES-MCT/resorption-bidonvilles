import { ActionSelectRow } from './fetchActions';
import Action from '#root/types/resources/Action.d';

export type ActionHash = { [key: number]: Action };

export default function hashActions(actions: ActionSelectRow[]): ActionHash {
    return actions.reduce((acc, row) => {
        acc[row.action_id] = {
            type: 'action',
            id: row.action_id,
            name: row.name,
            started_at: new Date(row.started_at).getTime(),
            ended_at: row.ended_at !== null ? new Date(row.ended_at).getTime() : null,
            goals: row.goals,
            topics: [],
            location: {
                type: 'departement',
                city: null,
                epci: null,
                departement: {
                    code: row.departement_code,
                    name: row.departement_name,
                },
                region: {
                    code: row.region_code,
                    name: row.region_name,
                },
            },
            location_type: row.location_type,
            eti: row.location_type === 'eti' ? {
                address: row.address,
                latitude: row.latitude,
                longitude: row.longitude,
                citycode: row.eti_fk_city,
            } : null,
            location_other: row.location_other,
            location_shantytowns: [],
            managers: [],
            operators: [],
            finances: {},
            metrics: [],
            metrics_updated_at: null,
            comments: [],
            created_at: row.created_at.getTime(),
            created_by: {
                id: row.creator_id,
                first_name: row.creator_first_name,
                last_name: row.creator_last_name,
                organization: {
                    id: row.creator_organization_id,
                    name: row.creator_organization_name,
                    abbreviation: row.creator_organization_abbreviation,
                },
            },
            updated_at: row.updated_at?.getTime() || null,
            updated_by: row.editor_id !== null ? {
                id: row.editor_id,
                first_name: row.editor_first_name,
                last_name: row.editor_last_name,
                organization: {
                    id: row.editor_organization_id,
                    name: row.editor_organization_name,
                    abbreviation: row.editor_organization_abbreviation,
                },
            } : null,
        };

        return acc;
    }, {} as ActionHash);
}
