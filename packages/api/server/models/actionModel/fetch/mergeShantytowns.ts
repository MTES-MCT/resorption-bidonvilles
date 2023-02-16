import getUsenameOf from '#server/models/shantytownModel/_common/getUsenameOf';
import { ActionHash } from './hashActions';
import { ActionShantytown } from './Action';
import { ActionShantytownRow } from './fetchShantytowns';

export default function mergeShantytowns(hash: ActionHash, shantytowns: ActionShantytownRow[]): void {
    shantytowns.forEach((row) => {
        const s: ActionShantytown = {
            id: row.id,
            address: row.address,
            name: row.name,
            closed_at: row.closed_at?.getTime() || null,
            usename: '',
            fieldType: {
                id: row.field_type_id,
                label: row.field_type_label,
            },
            city: {
                name: row.city_name,
            },
        };
        s.usename = getUsenameOf(s);
        hash[row.action_id].location_shantytowns.push(s);
    });
}
