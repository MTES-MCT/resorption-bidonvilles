import permissionModel from '#server/models/permissionModel';
import ServiceError from '#server/errors/ServiceError';
import permissionUtils from '#server/utils/permission';

function filterActiveAndTackedUser(user) {
    console.log('========================================');
    console.log(`user is active and tracked: ${(user.fk_status === 'active' && user.to_be_tracked === true)}`);
    console.log('========================================');
    return (user.fk_status === 'active' && user.to_be_tracked === true);
}

function filterUserWhoCanAccessJustice(user, location) {
    // console.log(`location: ${location.type}`);
    // console.log('========================================');
    // console.log(`user is allowed to access shantytown_justice: ${permissionUtils.can(user).do('access', 'shantytown_justice').on(location)}`);
    // console.log('========================================');
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
        console.log(`getUsersWhoCanAccessJustice returns: ${JSON.stringify(usersWhoCanAccessJustice)}`);
        if (usersWhoCanAccessJustice.length > 0) {
            usersWhoCanAccessJustice = await Promise.all(usersWhoCanAccessJustice.map(async user => setUserPermisions(user)));
            filteredUserssWhoCanAccessJustice = usersWhoCanAccessJustice.filter(user => (filterUserWhoCanAccessJustice(user, location) && filterActiveAndTackedUser(user)));
            console.log(`filteredUserssWhoCanAccessJustice: ${JSON.stringify(filteredUserssWhoCanAccessJustice.map(user => user.user_id))}`);
            return filteredUserssWhoCanAccessJustice;
        }
        return [];
    } catch (error) {
        console.log(error);
        throw new ServiceError('fetch_failed', new Error('Impossible de trouver les permissions d\'accès aux procédures judiciaires en base de données'));
    }
};
