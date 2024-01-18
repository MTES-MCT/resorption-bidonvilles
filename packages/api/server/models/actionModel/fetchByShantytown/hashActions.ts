import { ShantytownAction } from '#root/types/resources/Action.d';
import { ActionSelectRow } from './fetchActions';

export type ActionHash = {
    [key: number]: ShantytownAction
};

export default (actions: ActionSelectRow[]): ActionHash => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return actions.reduce((acc, row) => {
        acc[row.id] = {
            id: row.id,
            name: row.name,
            topics: [],
            operators: [],
            shantytowns: row.shantytowns,
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
            is_ended: row.ended_at !== null && new Date(row.ended_at) < today,
        };

        return acc;
    }, {} as ActionHash);
};
