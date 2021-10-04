module.exports = (user, plan, feature) => {
    if (!user.permissions.plan[feature] || !user.permissions.plan[feature].allowed) {
        return false;
    }

    switch (user.permissions.plan[feature].geographic_level) {
        case 'nation':
            return true;

        case 'local': {
            const userLevel = user.organization.location.type;
            switch (userLevel) {
                case 'nation':
                    return true;

                case 'region':
                    return user.organization.location.region.code === plan.region_code;

                default:
                    return user.organization.location.departement.code === plan.departement_code;
            }
        }

        case 'own':
            if (feature === 'updateMarks') {
                return plan.operators.some(contact => contact.organization.id === user.organization.id);
            }

            return plan.managers.some(({ id }) => id === user.id);

        default:
            return false;
    }
};
