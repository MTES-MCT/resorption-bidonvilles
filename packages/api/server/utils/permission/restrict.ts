import { Location } from '#server/models/geoModel/Location.d';
import getPermission from './getPermission';
import can from './can';
import { User } from '#root/types/resources/User.d';

export default (requestedLocation: Location) => ({
    for(user: User) {
        return {
            askingTo(feature: string, entity: string): Location[] {
                if (can(user).do(feature, entity).on(requestedLocation)) {
                    return [requestedLocation];
                }

                const permission = getPermission(user, feature, entity);
                if (permission === null) {
                    return [];
                }

                // on retourne tous les territoires qui font partie de celui demandé
                return [
                    permission.allowed_on.regions,
                    permission.allowed_on.departements,
                    permission.allowed_on.epci,
                    permission.allowed_on.cities,
                ].flat(2).filter((location) => {
                    if (requestedLocation.type === 'nation') {
                        return true;
                    }

                    if (!location[requestedLocation.type]) {
                        return false;
                    }

                    return location[requestedLocation.type].code === requestedLocation[requestedLocation.type].code;
                });
            },
        };
    },
});
