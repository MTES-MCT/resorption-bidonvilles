const defaultPermissions = {
    shantytown: {
        readOutsideTerritory: false,
        edit: true,
        create: false,
        close: false,
        readPrivateComments: false,
        hideJustice: false,
        hideOwner: true
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
        readPrivateComments: true,
        hideOwner: false
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
    city: {
        permissions: {
            ...defaultPermissions,
            shantytown: {
                ...defaultPermissions.shantytown,
                create: true
            },
            plan: {
                ...defaultPermissions.plan
            }
        },
        territory: "Bordeaux"
    },
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
        permissions: {
            ...defaultPermissions,
            plan: {
                ...defaultPermissions.plan,
                updateMarks: true
            }
        },
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
                readPrivateComments: true,
                hideOwner: false
            },
            plan: {
                ...defaultPermissions.plan,
                create: true,
                update: true,
                close: true
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
    },
    externalObservator: {
        permissions: {
            ...defaultPermissions,
            shantytown: {
                ...defaultPermissions.shantytown,
                edit: false,
                hideJustice: true
            }
        },
        territory: "National"
    }
};
