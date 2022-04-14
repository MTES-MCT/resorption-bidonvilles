const defaultPermissions = {
    shantytown: {
        readAccessExtendsTo: {
            category: "Département",
            name: "Gironde"
        },
        edit: true,
        create: false,
        close: false,
        readPrivateComments: false,
        accessJustice: false,
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
        readAccessExtendsTo: {
            category: null,
            name: "France"
        },
        edit: true,
        create: true,
        close: true,
        readPrivateComments: true,
        accessJustice: true,
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
    assoDepartementWithAccessJusticeOption: {
        permissions: {
            ...defaultPermissions,
            shantytown: {
                ...defaultPermissions.shantytown,
                accessJustice: true
            }
        },
        territory: "Gironde"
    },
    prefecture: {
        permissions: {
            ...defaultPermissions,
            shantytown: {
                ...defaultPermissions.shantytown,
                readAccessExtendsTo: {
                    category: null,
                    name: "France"
                },
                create: true,
                close: true,
                readPrivateComments: true,
                accessJustice: true,
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
                readAccessExtendsTo: {
                    category: null,
                    name: "France"
                },
                edit: false,
                create: false,
                close: false,
                readPrivateComments: false,
                accessJustice: true,
                readOutsideTerritory: true
            },
            admin: {
                ...defaultPermissions.admin,
                stats: true
            }
        },
        territory: "France"
    },
    localAdmin: {
        permissions: {
            ...localAdminPermissions,
            shantytown: {
                ...localAdminPermissions.shantytown,
                accessJustice: true
            }
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
        territory: "France"
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
        territory: "Gironde"
    }
};
