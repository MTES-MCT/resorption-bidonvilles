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

                // check the geographic level
                let permissionLevel = permission.geographic_level;
                if (permission.geographic_level === 'local') {
                    if (['epci', 'city'].includes(user.organization.location.type) && permission.is_writing === false) {
                        permissionLevel = 'departement';
                    } else {
                        permissionLevel = user.organization.location.type;
                    }
                }

                if (permissionLevel === 'nation') {
                    return true;
                }

                const locationLevel = location[permissionLevel];
                if (!locationLevel) {
                    return false;
                }

                const userLevel = user.organization.location[permissionLevel];
                if (!userLevel) {
                    return false;
                }

                return (userLevel.main || userLevel.code)
                            === (locationLevel.main || locationLevel.code);
            },
        };
    },
});
