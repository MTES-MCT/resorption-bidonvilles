const path = require("path");

const redirects = [{ from: "/landing", to: "/" }];

const anonymousRoutes = [
    {
        path: "/",
        component: path.join(__dirname, "./pages/LandingPage/index.vue")
    },
    {
        path: "/contact",
        component: path.join(__dirname, "./pages/Contact/index.vue")
    },
    {
        path: "/stats",
        component: path.join(__dirname, "./pages/PublicStats/index.vue")
    },
    {
        path: "/connexion",
        component: path.join(__dirname, "./pages/SignIn/index.vue")
    },
    {
        path: "/invitation",
        component: path.join(__dirname, "./pages/Invitation/index.vue")
    }
];

const loggedRoutes = [
    {
        path: "/launcher",
        component: path.join(__dirname, "./pages/launcher/launcher.vue")
    },
    {
        path: "/nouvelle-version",
        component: path.join(__dirname, "./pages/Invitation/index.vue")
    },
    // {
    //     path: "deconnexion",
    //     component: todo,
    //     meta: {
    //         analyticsIgnore: true
    //     }
    // },
    {
        path: "/cartographie",
        component: path.join(__dirname, "./pages/dashboard/dashboard.vue"),
        context: {
            beforeEnter: "loadedAndUpToDate",
            meta: {
                group: "townList"
            }
        }
    },
    {
        path: "/liste-des-sites",
        component: path.join(__dirname, "./pages/TownsList/TownsList.vue"),
        context: {
            beforeEnter: "loadedAndUpToDate",
            meta: {
                group: "townList"
            }
        }
    },
    {
        path: "/nouveau-site",
        component: path.join(__dirname, "./pages/TownCreate/TownCreate.vue"),
        context: {
            beforeEnter: "loadedAndUpToDate",
            meta: {
                group: "townCreation",
                permissions: ["shantytown.create"]
            }
        }
    },

    {
        path: "/site/:id",
        component: path.join(__dirname, "./pages/TownDetails/TownDetails.vue"),
        context: {
            meta: {
                group: "townList"
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/site/:id/mise-a-jour",
        component: path.join(__dirname, "./pages/TownUpdate/TownUpdate.vue"),
        context: {
            meta: {
                group: "townList"
            },
            beforeEnter: "loadedAndUpToDate"
        }
    }
    // {
    //     path: "/feedback",
    //     beforeEnter(to, from, next) {
    //         window.location.href =
    //             "mailto:contact@resorption-bidonvilles.beta.gouv.fr";
    //         next(false);
    //     }
    // },
    // {
    //     path: "/conditions-d-utilisation",
    //     beforeEnter(to, from, next) {
    //         window.open("/doc/CGU_2021_04_08.pdf");
    //         next(false);
    //     }
    // },
    // {
    //     path: "/typologie-des-acces",
    //     beforeEnter(to, from, next) {
    //         window.open("/doc/guide_de_l_administrateur.pdf");
    //         next(false);
    //     }
    // },
    // {
    //     path: "/charte-d-engagement",
    //     beforeEnter(to, from, next) {
    //         const {
    //             version_charte_engagement: { fichier }
    //         } = getConfig();
    //         window.open(fichier, "_blank");
    //         next(false);
    //     }
    // },
    // {
    //     path: "/mentions-legales",
    //     component: LegalMentions
    // },
    // {
    //     meta: {
    //         group: "account"
    //     },
    //     path: "/mon-compte",
    //     component: Me,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     meta: {
    //         group: "users",
    //         permissions: ["user.list"]
    //     },
    //     path: "/liste-des-utilisateurs",
    //     component: UserList,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     meta: {
    //         group: "userCreation",
    //         permissions: ["user.create"]
    //     },
    //     path: "/nouvel-utilisateur",
    //     component: UserCreate,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     path: "/signature-charte-engagement",
    //     component: CharteEngagement,
    //     beforeEnter: guard.bind(this, [
    //         { checker: isLoggedIn, target: "/connexion" },
    //         { checker: isConfigLoaded, target: "/launcher" },
    //         { checker: isPermitted, target: "/", saveEntrypoint: false },
    //         {
    //             checker() {
    //                 return !hasAcceptedCharte();
    //             },
    //             target: "/"
    //         }
    //     ])
    // },
    // {
    //     meta: {
    //         group: "users",
    //         permissions: ["user.activate"]
    //     },
    //     path: "/nouvel-utilisateur/:id",
    //     component: UserValidate,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     meta: {
    //         group: "users"
    //     },
    //     path: "/mise-a-niveau",
    //     component: UserUpgrade,
    //     beforeEnter: guardians.loaded
    // },
    // {
    //     meta: {
    //         group: "users"
    //     },
    //     path: "/nouveau-mot-de-passe",
    //     component: UserRequestNewPassword,
    //     beforeEnter: guardians.anonymous
    // },
    // {
    //     meta: {
    //         group: "users"
    //     },
    //     path: "/renouveler-mot-de-passe/:token",
    //     component: UserSetNewPassword,
    //     beforeEnter: guardians.anonymous
    // },
    // {
    //     meta: {
    //         group: "account"
    //     },
    //     path: "/activer-mon-compte/:token",
    //     component: UserActivate,
    //     beforeEnter: guardians.anonymous
    // },
    // {
    //     meta: {
    //         group: "plans",
    //         permissions: ["plan.list"]
    //     },
    //     path: "/liste-des-dispositifs",
    //     component: PlanList,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     meta: {
    //         group: "plans",
    //         permissions: ["plan.create"]
    //     },
    //     path: "/nouveau-dispositif",
    //     component: PlanCreate,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     meta: {
    //         group: "plans",
    //         permissions: ["plan.update"]
    //     },
    //     path: "/modifier-dispositif/:id",
    //     component: PlanEdit,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     meta: {
    //         group: "plans",
    //         permissions: ["plan.read"]
    //     },
    //     path: "/dispositif/:id",
    //     component: PlanDetails,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     meta: {
    //         group: "plans",
    //         permissions: ["plan.updateMarks"]
    //     },
    //     path: "/dispositif/:id/indicateurs",
    //     component: PlanMarks,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     path: "/statistiques/:code?",
    //     meta: {
    //         group: "stats",
    //         permissions: ["stats.read"]
    //     },
    //     component: PrivateStats,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     path: "/activites",
    //     meta: {
    //         group: "history",
    //         permissions: ["shantytown.list"]
    //     },
    //     component: History,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     path: "/activites/:locationType/:locationCode?",
    //     meta: {
    //         group: "history",
    //         permissions: ["shantytown.list"]
    //     },
    //     component: History,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     meta: {
    //         group: "covid"
    //     },
    //     path: "/covid-19",
    //     component: Covid,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     meta: {
    //         group: "directory"
    //     },
    //     path: "/annuaire/",
    //     component: OrganizationList,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     meta: {
    //         group: "directory"
    //     },
    //     path: "/annuaire/:id",
    //     component: OrganizationDetails,
    //     beforeEnter: guardians.loadedAndUpToDate
    // },
    // {
    //     path: "/fiches-hebergement-logement-adapte",
    //     beforeEnter(to, from, next) {
    //         window.open("/doc/fiches-hebergement-logement-adapte.pdf");
    //         next(false);
    //     }
    // },
    // {
    //     path: "/fiche-bidonvilles-maraudes",
    //     beforeEnter(to, from, next) {
    //         window.open("/doc/fiche-bidonvilles-maraudes.pdf");
    //         next(false);
    //     }
    // },
    // {
    //     path: "/covid-19-recommandations-vaccination",
    //     beforeEnter(to, from, next) {
    //         window.open("/doc/covid-19-recommandations-vaccination.pdf");
    //         next(false);
    //     }
    // }
];

module.exports = [
    ...anonymousRoutes,
    // ...loggedRoutes
];
