import { SerializedUser } from '#server/models/userModel/_common/serializeUser';

export default (user: SerializedUser, feature: string, entity: string) => {
    if (!user.permissions[entity]) {
        return null;
    }

    const permission = user.permissions[entity][feature];
    if (!permission || permission.allowed !== true) {
        return null;
    }

    return permission;
};
