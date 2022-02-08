const getPermission = require('./getPermission');

module.exports = user => ({
    do(feature, entity) {
        return {
            on(location) {
                // ensure the user has the permission (has it AND allowed is true)
                const permission = getPermission(user, feature, entity);
                if (!permission) {
                    return false;
                }

                // if the permission is allowed everywhere: we can stop here
                if (permission.allow_all === true) {
                    return true;
                }

                // check shantytowns and plans
                let geoLocation = location;
                if (location.type === 'shantytown') {
                    if (permission.allowed_on.shantytowns.includes(location.id)) {
                        return true;
                    }

                    geoLocation = {
                        type: 'city',
                        region: location.region,
                        departement: location.departement,
                        epci: location.epci,
                        city: location.city,
                    };
                }

                if (location.type === 'plan') {
                    if (permission.allowed_on.plans.includes(location.id)) {
                        return true;
                    }

                    geoLocation = location.geo_location;
                }

                // check locations
                if (geoLocation.city !== null && (permission.allowed_on.cities.includes(geoLocation.city.code) || permission.allowed_on.cities.includes(geoLocation.city.main))) {
                    return true;
                }

                if (geoLocation.epci !== null && permission.allowed_on.epci.includes(geoLocation.epci.code)) {
                    return true;
                }

                if (geoLocation.departement !== null && permission.allowed_on.departements.includes(geoLocation.departement.code)) {
                    return true;
                }

                if (geoLocation.region !== null && permission.allowed_on.regions.includes(geoLocation.region.code)) {
                    return true;
                }

                return false;
            },
        };
    },
});
