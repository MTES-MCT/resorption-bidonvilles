const defaultPermissions = {
    shantytown: {
        readOutsideTerritory: false,
        edit: true,
        create: false,
        close: false,
        readPrivateComments: false,
        hideJustice: false
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
    departementWithHideOption: {
        permissions: {
            ...defaultPermissions,
            shantytown: {
                ...defaultPermissions.shantytown,
                hideJustice: true
            }
        },
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
                edit: false,
                hideJustice: true
            }
        },
        territory: "Gironde"
    },
    national: {
        permissions: {
            ...defaultPermissions,
            shantytown: {
                ...defaultPermissions.shantytown,
                edit: false,
                create: false,
                close: false,
                readPrivateComments: false,
                readOutsideTerritory: true
            },
            admin: {
                ...defaultPermissions.admin,
                stats: true
            }
        },
        territory: "National"
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
