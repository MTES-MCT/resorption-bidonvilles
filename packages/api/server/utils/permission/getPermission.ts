import { Permission } from '#server/models/permissionModel/types/Permission.d';
import { User } from '#root/types/resources/User.d';

export default (user: User, feature: string, entity: string): Permission => {
    if (!user.permissions[entity]) {
        return null;
    }

    const permission = user.permissions[entity][feature];
    if (!permission || permission.allowed !== true) {
        return null;
    }

    return permission;
};
