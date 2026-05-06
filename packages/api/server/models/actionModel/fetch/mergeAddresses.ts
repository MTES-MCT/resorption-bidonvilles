import { ActionHash } from './hashActions';
import { ActionAddressRow } from './fetchAddresses';

export default function mergeAddresses(actions: ActionHash, addresses: ActionAddressRow[]): ActionHash {
    addresses.forEach((address) => {
        const action = actions[address.action_id];
        if (!action) {
            return;
        }

        if (!action.eti) {
            action.eti = [];
        }

        action.eti.push({
            id: address.action_address_id,
            address: address.address,
            latitude: address.latitude,
            longitude: address.longitude,
            citycode: address.fk_city,
        });
    });

    return actions;
}
