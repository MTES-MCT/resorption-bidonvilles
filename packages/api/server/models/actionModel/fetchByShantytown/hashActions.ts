import { ShantytownAction } from '../fetch/Action.d';
import { ActionSelectRow } from './fetchActions';

export type ActionHash = {
    [key: number]: ShantytownAction
};

export default (actions: ActionSelectRow[]): ActionHash => actions.reduce((acc, row) => {
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
    };

    return acc;
}, {} as ActionHash);
