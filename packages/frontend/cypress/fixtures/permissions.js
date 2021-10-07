const defaultPermissions = {
    shantytown: {
        readOutsideTerritory: false,
        edit: true,
        create: false,
        close: false,
        readPrivateComments: false
    },
    plan: {
        create: false
    },
    admin: {
        listUsers: false,
        createUser: false,
        stats: false
    }
};

const localAdminPermissions = {
    shantytown: {
        readOutsideTerritory: true,
        edit: true,
        create: true,
        close: true,
        readPrivateComments: true
    },
    plan: {
        create: true
    },
    admin: {
        listUsers: true,
        createUser: true,
        stats: true
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
    prefecture: {
        permissions: {
            ...defaultPermissions,
            shantytown: {
                ...defaultPermissions.shantytown,
                readOutsideTerritory: true,
                create: true,
                close: true,
                readPrivateComments: true
            },
            plan: {
                ...defaultPermissions.shantytown,
                create: true
            }
        },
        territory: "Gironde"
    },
    intervenant: {
        permissions: {
            ...defaultPermissions,
            shantytown: {
                ...defaultPermissions.shantytown,
                edit: false
            }
        },
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
                ...localAdminPermissions.admin
            }
        },
        territory: "Bordeaux"
    }
};
