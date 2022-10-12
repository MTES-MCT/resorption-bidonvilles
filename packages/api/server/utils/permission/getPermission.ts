module.exports = (user, feature, entity) => {
    if (!user.permissions[entity]) {
        return null;
    }

    const permission = user.permissions[entity][feature];
    if (!permission || permission.allowed !== true) {
        return null;
    }

    return permission;
};
