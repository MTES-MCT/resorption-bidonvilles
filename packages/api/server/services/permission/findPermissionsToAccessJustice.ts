import permissionModel from '#server/models/permissionModel';
import ServiceError from '#server/errors/ServiceError';
import permissionUtils from '#server/utils/permission';

function filterActiveAndTackedUser(user) {
    return (user.fk_status === 'active' && user.to_be_tracked === true);
}

function filterUserWhoCanAccessJustice(user, location) {
    return permissionUtils.can(user).do('access', 'shantytown_justice').on(location);
}

function getUsersWhoCanAccessJustice() {
    return permissionModel.findPermissionsToAccessJustice();
}

async function setUserPermisions(user) {
    let permissionMap = null;
    permissionMap = await permissionModel.find(user.user_id);
    Object.assign(user, {
        permissions: permissionMap[user.user_id],
    });
    return user;
}

export default async (location) => {
    let usersWhoCanAccessJustice = [];
    let filteredUserssWhoCanAccessJustice = [];
    try {
        usersWhoCanAccessJustice = await getUsersWhoCanAccessJustice();
        if (usersWhoCanAccessJustice.length > 0) {
            usersWhoCanAccessJustice = await Promise.all(usersWhoCanAccessJustice.map(async user => setUserPermisions(user)));
            filteredUserssWhoCanAccessJustice = usersWhoCanAccessJustice.filter(user => (filterUserWhoCanAccessJustice(user, location) && filterActiveAndTackedUser(user)));
            return filteredUserssWhoCanAccessJustice;
        }
        return [];
    } catch (error) {
        throw new ServiceError('fetch_failed', new Error('Impossible de trouver les permissions d\'accès aux procédures judiciaires en base de données'));
    }
};
