const path = require("path");

const anonymousRoutes = [
    {
        path: "/",
        component: path.join(
            __dirname,
            "./src/js/app/pages/LandingPage/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "home",
                ssr: true
            }
        }
    },
    {
        path: "/contact",
        component: path.join(
            __dirname,
            "./src/js/app/pages/Contact/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "anonymous",
                ssr: true
            }
        }
    },
    {
        path: "/stats",
        component: path.join(
            __dirname,
            "./src/js/app/pages/PublicStats/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "anonymous",
                ssr: true
            }
        }
    },
    {
        path: "/connexion",
        component: path.join(
            __dirname,
            "./src/js/app/pages/SignIn/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "anonymous",
                ssr: true
            }
        }
    },
    {
        path: "/invitation",
        component: path.join(
            __dirname,
            "./src/js/app/pages/Invitation/entrypoint.vue"
        ),
        route: {
            meta: {
                ssr: true
            }
        }
    },
    {
        path: "/mentions-legales",
        component: path.join(
            __dirname,
            "./src/js/app/pages/legalMentions/entrypoint.vue"
        ),
        route: {
            meta: {
                ssr: true
            }
        }
    },
    {
        path: "/nouveau-mot-de-passe",
        component: path.join(
            __dirname,
            "./src/js/app/pages/UserRequestNewPassword/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "users",
                beforeEnter: "anonymous",
                ssr: true
            }
        }
    },
    {
        path: "/test-table",
        component: path.join(
            __dirname,
            "./src/js/app/pages/TestTable/entrypoint.vue"
        ),
        route: {
            meta: {
                ssr: true
            }
        }
    }
];

const anonymousWithoutRendering = [
    {
        path: "/renouveler-mot-de-passe/:token",
        component: path.join(
            __dirname,
            "./src/js/app/pages/UserSetNewPassword/index.vue"
        ),
        route: {
            meta: {
                group: "users",
                beforeEnter: "anonymous"
            }
        }
    },
    {
        path: "/activer-mon-compte/:token",
        component: path.join(
            __dirname,
            "./src/js/app/pages/UserActivate/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "account",
                beforeEnter: "anonymous"
            }
        }
    }
];

const loggedRoutes = [
    {
        path: "/nouvelle-version",
        component: path.join(
            __dirname,
            "./src/js/app/pages/Changelog/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "loadedAndUpgraded"
            }
        }
    },
    {
        path: "/cartographie",
        component: path.join(
            __dirname,
            "./src/js/app/pages/dashboard/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "loadedAndUpToDate",
                group: "townList"
            }
        }
    },
    {
        path: "/liste-des-sites",
        component: path.join(
            __dirname,
            "./src/js/app/pages/TownsList/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "loadedAndUpToDate",
                group: "townList"
            }
        }
    },
    {
        path: "/nouveau-site",
        component: path.join(
            __dirname,
            "./src/js/app/pages/TownCreate/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "loadedAndUpToDate",
                group: "townCreation",
                permissions: ["shantytown.create"]
            }
        }
    },
    {
        path: "/site/:id",
        component: path.join(
            __dirname,
            "./src/js/app/pages/TownDetails/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "loadedAndUpToDate",
                group: "townList"
            }
        }
    },
    {
        path: "/site/:id/mise-a-jour",
        component: path.join(
            __dirname,
            "./src/js/app/pages/TownUpdate/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "loadedAndUpToDate",
                group: "townList"
            }
        }
    },

    {
        path: "/mon-compte",
        component: path.join(
            __dirname,
            "./src/js/app/pages/Account/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "loadedAndUpToDate",
                group: "account"
            }
        }
    },
    {
        path: "/utilisateur/:id",
        component: path.join(
            __dirname,
            "./src/js/app/pages/Account/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "loadedAndUpToDate",
                group: "account"
            }
        }
    },
    {
        path: "/liste-des-utilisateurs",
        component: path.join(
            __dirname,
            "./src/js/app/pages/UserList/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "loadedAndUpToDate",
                group: "users",
                permissions: ["user.list"]
            }
        }
    },
    {
        path: "/nouvel-utilisateur",
        component: path.join(
            __dirname,
            "./src/js/app/pages/UserCreate/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "loadedAndUpToDate",
                group: "userCreation",
                permissions: ["user.create"]
            }
        }
    },
    {
        path: "/signature-charte-engagement",
        component: path.join(
            __dirname,
            "./src/js/app/pages/CharteEngagement/entrypoint.vue"
        ),
        route: {
            meta: {
                beforeEnter: "loaded"
            }
        }
    },
    {
        path: "/nouvel-utilisateur/:id",
        component: path.join(
            __dirname,
            "./src/js/app/pages/UserValidate/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "users",
                permissions: ["user.activate"],
                beforeEnter: "loadedAndUpToDate"
            }
        }
    },
    {
        path: "/mise-a-niveau",
        component: path.join(
            __dirname,
            "./src/js/app/pages/users.upgrade/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "users",
                beforeEnter: "loaded"
            }
        }
    },
    {
        path: "/liste-des-dispositifs",
        component: path.join(
            __dirname,
            "./src/js/app/pages/plans.list/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "plans",
                permissions: ["plan.list"],
                beforeEnter: "loadedAndUpToDate"
            }
        }
    },
    {
        path: "/nouveau-dispositif",
        component: path.join(
            __dirname,
            "./src/js/app/pages/plans.create/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "plans",
                permissions: ["plan.create"],
                beforeEnter: "loadedAndUpToDate"
            }
        }
    },
    {
        path: "/modifier-dispositif/:id",
        component: path.join(
            __dirname,
            "./src/js/app/pages/plans.edit/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "plans",
                permissions: ["plan.update"],
                beforeEnter: "loadedAndUpToDate"
            }
        }
    },
    {
        path: "/dispositif/:id",
        component: path.join(
            __dirname,
            "./src/js/app/pages/plans.details/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "plans",
                permissions: ["plan.read"],
                beforeEnter: "loadedAndUpToDate"
            }
        }
    },
    {
        path: "/dispositif/:id/indicateurs",
        component: path.join(
            __dirname,
            "./src/js/app/pages/plans.marks/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "plans",
                permissions: ["plan.updateMarks"],
                beforeEnter: "loadedAndUpToDate"
            }
        }
    },
    {
        path: "/statistiques/:code?",
        component: path.join(
            __dirname,
            "./src/js/app/pages/PrivateStats/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "stats",
                permissions: ["stats.read"],
                beforeEnter: "loadedAndUpToDate"
            }
        }
    },
    {
        path: "/activites",
        component: path.join(
            __dirname,
            "./src/js/app/pages/History/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "history",
                permissions: ["shantytown.list"],
                beforeEnter: "loadedAndUpToDate"
            }
        }
    },
    {
        path: "/activites/:locationType/:locationCode?",
        component: path.join(
            __dirname,
            "./src/js/app/pages/History/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "history",
                permissions: ["shantytown.list"],
                beforeEnter: "loadedAndUpToDate"
            }
        }
    },
    {
        path: "/covid-19",
        component: path.join(
            __dirname,
            "./src/js/app/pages/covid/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "covid",
                beforeEnter: "loadedAndUpToDate"
            }
        }
    },
    {
        path: "/annuaire",
        component: path.join(
            __dirname,
            "./src/js/app/pages/OrganizationList/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "directory",
                beforeEnter: "loadedAndUpToDate"
            }
        }
    },
    {
        path: "/annuaire/:id",
        component: path.join(
            __dirname,
            "./src/js/app/pages/OrganizationDetails/entrypoint.vue"
        ),
        route: {
            meta: {
                group: "directory",
                beforeEnter: "loadedAndUpToDate"
            }
        }
    }
];

const actionRoutes = [
    {
        path: "/deconnexion",
        component: path.join(
            __dirname,
            "./src/js/app/pages/EmptyPage/index.vue"
        ),
        route: {
            meta: {
                analyticsIgnore: true,
                beforeEnter: {
                    action: "signout",
                    to: "/"
                }
            }
        }
    }
];

const fileRoutes = [
    {
        path: "/feedback",
        component: path.join(
            __dirname,
            "./src/js/app/pages/EmptyPage/index.vue"
        ),
        route: {
            meta: {
                beforeEnter: {
                    action: "open",
                    to: "mailto:contact@resorption-bidonvilles.beta.gouv.fr"
                }
            }
        }
    },
    {
        path: "/conditions-d-utilisation",
        component: path.join(
            __dirname,
            "./src/js/app/pages/EmptyPage/index.vue"
        ),
        route: {
            meta: {
                beforeEnter: {
                    action: "open",
                    to: "/doc/CGU_2021_04_08.pdf"
                }
            }
        }
    },
    {
        path: "/typologie-des-acces",
        component: path.join(
            __dirname,
            "./src/js/app/pages/EmptyPage/index.vue"
        ),
        route: {
            meta: {
                beforeEnter: {
                    action: "open",
                    to: "/doc/guide_de_l_administrateur.pdf"
                }
            }
        }
    },
    {
        path: "/charte-d-engagement",
        component: path.join(
            __dirname,
            "./src/js/app/pages/EmptyPage/index.vue"
        ),
        route: {
            meta: {
                // TODO: FIX, charte is not implemented in guard
                beforeEnter: "charte"
            }
        }
    },
    {
        path: "/fiches-hebergement-logement-adapte",
        component: path.join(
            __dirname,
            "./src/js/app/pages/EmptyPage/index.vue"
        ),
        route: {
            meta: {
                beforeEnter: {
                    action: "open",
                    to: "/doc/fiches-hebergement-logement-adapte.pdf"
                }
            }
        }
    },
    {
        path: "/fiche-bidonvilles-maraudes",
        component: path.join(
            __dirname,
            "./src/js/app/pages/EmptyPage/index.vue"
        ),
        route: {
            meta: {
                beforeEnter: {
                    action: "open",
                    to: "/doc/fiche-bidonvilles-maraudes.pdf"
                }
            }
        }
    },
    {
        path: "/covid-19-recommandations-vaccination",
        component: path.join(
            __dirname,
            "./src/js/app/pages/EmptyPage/index.vue"
        ),
        route: {
            meta: {
                beforeEnter: {
                    action: "open",
                    to: "/doc/covid-19-recommandations-vaccination.pdf"
                }
            }
        }
    }
];

const redirects = [
    {
        path: "/landing",
        component: path.join(
            __dirname,
            "./src/js/app/pages/EmptyPage/index.vue"
        ),
        route: {
            meta: {
                beforeEnter: {
                    action: "redirect",
                    to: "/"
                }
            }
        }
    },
    {
        path: "/launcher",
        component: path.join(
            __dirname,
            "./src/js/app/pages/EmptyPage/index.vue"
        ),
        route: {
            meta: {
                beforeEnter: {
                    action: "redirect",
                    to: "/"
                }
            }
        }
    }
];

module.exports = [
    ...anonymousRoutes,
    ...anonymousWithoutRendering,
    ...loggedRoutes,
    ...fileRoutes,
    ...actionRoutes,
    ...redirects
];
