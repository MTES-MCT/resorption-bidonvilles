import getPermission from './getPermission';
import can from './can';

export default requestedLocation => ({
    for(user) {
        return {
            askingTo(feature, entity) {
                if (can(user).do(feature, entity).on(requestedLocation)) {
                    return requestedLocation;
                }

                const permission = getPermission(user, feature, entity);
                if (permission === null) {
                    return null;
                }

                // local permissions
                let level = user.organization.location.type;
                if (permission.is_writing === false && ['city', 'epci'].includes(user.organization.location.type)) {
                    level = 'departement';
                }

                if (!user.organization.location[level] || (requestedLocation[level] && user.organization.location[level].code !== requestedLocation[level].code)) {
                    return null;
                }

                const hierarchy = {
                    region: ['region'],
                    departement: ['region', 'departement'],
                    epci: ['region', 'departement', 'epci'],
                    city: ['region', 'departement', 'epci', 'city'],
                };

                return {
                    type: level,
                    region: hierarchy[level].includes('region') ? user.organization.location.region || null : null,
                    departement: hierarchy[level].includes('departement') ? user.organization.location.departement || null : null,
                    epci: hierarchy[level].includes('epci') ? user.organization.location.epci || null : null,
                    city: hierarchy[level].includes('city') ? user.organization.location.city || null : null,
                };
            },
        };
    },
});
