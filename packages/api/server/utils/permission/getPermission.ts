import { User } from '#root/types/resources/User.d';

export default (user: User, feature: string, entity: string) => {
    if (!user.permissions[entity]) {
        return null;
    }

    const permission = user.permissions[entity][feature];
    if (!permission || permission.allowed !== true) {
        return null;
    }

    return permission;
};
