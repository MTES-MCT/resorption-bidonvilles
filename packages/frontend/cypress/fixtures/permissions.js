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
        create: false,
        update: false,
        updateMarks: false,
        close: false
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
        create: true,
        update: true,
        updateMarks: true,
        close: true
    },
    admin: {
        listUsers: true,
        createUser: true,
        stats: true
    }
};

module.exports = {
    assoCity: {
        permissions: defaultPermissions,
        territory: "Bordeaux"
    },
    assoCityWithCreateOption: {
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
    assoDepartement: {
        permissions: defaultPermissions,
        territory: "Gironde"
    },
    assoDepartementWithHideOption: {
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
