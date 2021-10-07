const defaultPermissions = {
    shantytown: {
        read: true,
        readOutsideTerritory: false,
        edit: true,
        create: false,
        close: false
    },
    plan: {
        read: true,
        edit: false,
        create: false
    },
    admin: {
        listUsers: false,
        createUser: false,
        stats: false,
        promoteLocalAdmin: false,
        promoteInterevenant: false
    }
};

const localAdminPermissions = {
    shantytown: {
        read: true,
        readOutsideTerritory: true,
        edit: true,
        create: true,
        close: true
    },
    plan: {
        read: true,
        edit: true,
        create: true
    },
    admin: {
        listUsers: true,
        createUser: true,
        stats: true,
        promoteLocalAdmin: false,
        promoteInterevenant: false
    }
};

module.exports = {
    city: {
        permissions: defaultPermissions,
        territory: "Bordeaux"
    },
    cityWithCreateOption: {
        permissions: {
            ...defaultPermissions,
            shantytown: {
                ...defaultPermissions.shantytown,
                create: true,
                close: true
            }
        },
        territory: "Bordeaux"
    },
    departement: {
        permissions: defaultPermissions,
        territory: "Gironde"
    },
    localAdmin: {
        permissions: {
            ...localAdminPermissions
        },
        territory: "Gironde"
    },
    nationalAdmin: {
        permissions: {
            ...localAdminPermissions,
            admin: {
                ...localAdminPermissions.admin,
                promoteInterevenant: true,
                promoteLocalAdmin: true
            }
        },
        territory: "Bordeaux"
    }
};
