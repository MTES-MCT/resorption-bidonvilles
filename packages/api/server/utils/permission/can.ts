import { Location as GeoLocation } from '#server/models/geoModel/Location.d';
import Action from '#root/types/resources/Action.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { User } from '#root/types/resources/User.d';
import getPermission from './getPermission';

export default (user: User) => ({
    do(feature: string, entity: string) {
        return {
            on(location: GeoLocation | Shantytown | Action): boolean {
                // ensure the user has the permission (has it AND allowed is true)
                const permission = getPermission(user, feature, entity);

                if (!permission) {
                    return false;
                }

                // if the permission is allowed everywhere: we can stop here
                if (permission.allowed_on_national === true) {
                    return true;
                }

                // compute the geo-location
                let geoLocation: GeoLocation;
                if (location.type === 'shantytown') {
                    geoLocation = {
                        type: 'city',
                        region: location.region,
                        departement: location.departement,
                        epci: location.epci,
                        city: location.city,
                    };
                } else if (location.type === 'action') {
                    if (permission.allowed_on.actions.includes(location.id)) {
                        return true;
                    }
                    geoLocation = location.location;
                } else {
                    geoLocation = location;
                }

                // check locations
                const plural = {
                    city: 'cities',
                    epci: 'epci',
                    departement: 'departements',
                    region: 'regions',
                };

                return Object.keys(plural).some((type) => {
                    if (!geoLocation[type]) {
                        return false;
                    }

                    return permission.allowed_on[plural[type]].some(l => l[type].code === geoLocation[type].code || l[type].code === geoLocation[type].main);
                });
            },
        };
    },
});
