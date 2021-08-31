const path = require("path");

const anonymousRoutes = [
    {
        path: "/",
        component: path.join(__dirname, "./pages/LandingPage/index.vue"),
        context: {
            beforeEnter: "home"
        }
    },
    {
        path: "/contact",
        component: path.join(__dirname, "./pages/Contact/index.vue"),
        context: {
            beforeEnter: "anonymous"
        }
    },
    {
        path: "/stats",
        component: path.join(__dirname, "./pages/PublicStats/index.vue"),
        context: {
            beforeEnter: "anonymous"
        }
    },
    {
        path: "/connexion",
        component: path.join(__dirname, "./pages/SignIn/index.vue"),
        context: {
            beforeEnter: "anonymous"
        }
    },
    {
        path: "/invitation",
        component: path.join(__dirname, "./pages/Invitation/index.vue")
    },
    {
        path: "/mentions-legales",
        component: path.join(
            __dirname,
            "./pages/legalMentions/legalMentions.vue"
        )
    },
    {
        path: "/nouveau-mot-de-passe",
        component: path.join(
            __dirname,
            "./pages/UserRequestNewPassword/index.vue"
        ),
        context: {
            meta: {
                group: "users"
            },
            beforeEnter: "anonymous"
        }
    },
    {
        path: "/renouveler-mot-de-passe/:token",
        component: path.join(
            __dirname,
            "./pages/UserSetNewPassword/index.vue"
        ),
        context: {
            meta: {
                group: "users"
            },
            beforeEnter: "anonymous"
        }
    },
];

const loggedRoutes = [
    {
        path: "/launcher",
        component: path.join(__dirname, "./pages/launcher/entrypoint.vue"),
        context: {
            beforeEnter: "loggedIn"
        }
    },
    {
        path: "/nouvelle-version",
        component: path.join(__dirname, "./pages/Invitation/entrypoint.vue"),
        context: {
            beforeEnter: "loadedAndUpgraded"
        }
    },
    {
        path: "/cartographie",
        component: path.join(__dirname, "./pages/dashboard/entrypoint.vue"),
        context: {
            beforeEnter: "loadedAndUpToDate",
            meta: {
                group: "townList"
            }
        }
    },
    {
        path: "/liste-des-sites",
        component: path.join(__dirname, "./pages/TownsList/entrypoint.vue"),
        context: {
            beforeEnter: "loadedAndUpToDate",
            meta: {
                group: "townList"
            }
        }
    },
    {
        path: "/nouveau-site",
        component: path.join(__dirname, "./pages/TownCreate/entrypoint.vue"),
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
        component: path.join(__dirname, "./pages/TownDetails/entrypoint.vue"),
        context: {
            meta: {
                group: "townList"
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/site/:id/mise-a-jour",
        component: path.join(__dirname, "./pages/TownUpdate/entrypoint.vue"),
        context: {
            meta: {
                group: "townList"
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },

    {
        path: "/mon-compte",
        component: path.join(__dirname, "./pages/me/entrypoint.vue"),
        context: {
            meta: {
                group: "account"
            },

            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/liste-des-utilisateurs",
        component: path.join(__dirname, "./pages/UserList/entrypoint.vue"),
        context: {
            meta: {
                group: "users",
                permissions: ["user.list"]
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/nouvel-utilisateur",
        component: path.join(__dirname, "./pages/UserCreate/entrypoint.vue"),
        context: {
            meta: {
                group: "userCreation",
                permissions: ["user.create"]
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/signature-charte-engagement",
        component: path.join(
            __dirname,
            "./pages/CharteEngagement/entrypoint.vue"
        ),
        context: {
            beforeEnter: "signatureCharte"
        }
    },
    {
        path: "/nouvel-utilisateur/:id",
        component: path.join(__dirname, "./pages/UserValidate/entrypoint.vue"),
        context: {
            meta: {
                group: "users",
                permissions: ["user.activate"]
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/mise-a-niveau",
        component: path.join(__dirname, "./pages/users.upgrade/entrypoint.vue"),
        context: {
            meta: {
                group: "users"
            },
            beforeEnter: "loaded"
        }
    },
    {
        path: "/activer-mon-compte/:token",
        component: path.join(__dirname, "./pages/UserActivate/entrypoint.vue"),
        context: {
            meta: {
                group: "account"
            },
            beforeEnter: "anonymous"
        }
    },
    {
        path: "/liste-des-dispositifs",
        component: path.join(__dirname, "./pages/plans.list/entrypoint.vue"),
        context: {
            meta: {
                group: "plans",
                permissions: ["plan.list"]
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/nouveau-dispositif",
        component: path.join(__dirname, "./pages/plans.create/entrypoint.vue"),
        context: {
            meta: {
                group: "plans",
                permissions: ["plan.create"]
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/modifier-dispositif/:id",
        component: path.join(__dirname, "./pages/plans.edit/entrypoint.vue"),
        context: {
            meta: {
                group: "plans",
                permissions: ["plan.update"]
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/dispositif/:id",
        component: path.join(__dirname, "./pages/plans.details/entrypoint.vue"),
        context: {
            meta: {
                group: "plans",
                permissions: ["plan.read"]
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/dispositif/:id/indicateurs",
        component: path.join(__dirname, "./pages/plans.marks/entrypoint.vue"),
        context: {
            meta: {
                group: "plans",
                permissions: ["plan.updateMarks"]
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/statistiques/:code?",
        component: path.join(__dirname, "./pages/PrivateStats/entrypoint.vue"),
        context: {
            meta: {
                group: "stats",
                permissions: ["stats.read"]
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/activites",
        component: path.join(__dirname, "./pages/History/entrypoint.vue"),
        context: {
            meta: {
                group: "history",
                permissions: ["shantytown.list"]
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/activites/:locationType/:locationCode?",
        component: path.join(__dirname, "./pages/History/entrypoint.vue"),
        context: {
            meta: {
                group: "history",
                permissions: ["shantytown.list"]
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/covid-19",
        component: path.join(__dirname, "./pages/covid/entrypoint.vue"),
        context: {
            meta: {
                group: "covid"
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/annuaire",
        component: path.join(
            __dirname,
            "./pages/OrganizationList/entrypoint.vue"
        ),
        context: {
            meta: {
                group: "directory"
            },
            beforeEnter: "loadedAndUpToDate"
        }
    },
    {
        path: "/annuaire/:id",
        component: path.join(
            __dirname,
            "./pages/OrganizationDetails/entrypoint.vue"
        ),
        context: {
            meta: {
                group: "directory"
            },
            beforeEnter: "loadedAndUpToDate"
        }
    }
];

const actionRoutes = [
    {
        path: "/deconnexion",
        component: path.join(__dirname, "./pages/EmptyPage/index.vue"),
        context: {
            meta: {
                analyticsIgnore: true
            },
            beforeEnter: (to, from, next) => {
                // TODO: FIX
                // logout(Vue.prototype.$piwik);
                next("/");
            }
        }
    }
];

const fileRoutes = [
    {
        path: "/feedback",
        component: path.join(__dirname, "./pages/EmptyPage/index.vue"),
        context: {
            beforeEnter(to, from, next) {
                window.location.href =
                    "mailto:contact@resorption-bidonvilles.beta.gouv.fr";
                next(false);
            }
        }
    },
    {
        path: "/conditions-d-utilisation",
        component: path.join(__dirname, "./pages/EmptyPage/index.vue"),
        context: {
            beforeEnter(to, from, next) {
                window.open("/doc/CGU_2021_04_08.pdf");
                next(false);
            }
        }
    },
    {
        path: "/typologie-des-acces",
        component: path.join(__dirname, "./pages/EmptyPage/index.vue"),
        context: {
            beforeEnter(to, from, next) {
                window.open("/doc/guide_de_l_administrateur.pdf");
                next(false);
            }
        }
    },
    {
        path: "/charte-d-engagement",
        component: path.join(__dirname, "./pages/EmptyPage/index.vue"),
        context: {
            // beforeEnter(to, from, next) {
            // TODO: FIX
            // const {
            //     version_charte_engagement: { fichier }
            // } = getConfig();
            // window.open(fichier, "_blank");
            // next(false);
            // }
        }
    },
    {
        path: "/fiches-hebergement-logement-adapte",
        component: path.join(__dirname, "./pages/EmptyPage/index.vue"),
        context: {
            beforeEnter(to, from, next) {
                window.open("/doc/fiches-hebergement-logement-adapte.pdf");
                next(false);
            }
        }
    },
    {
        path: "/fiche-bidonvilles-maraudes",
        component: path.join(__dirname, "./pages/EmptyPage/index.vue"),
        context: {
            beforeEnter(to, from, next) {
                window.open("/doc/fiche-bidonvilles-maraudes.pdf");
                next(false);
            }
        }
    },
    {
        path: "/covid-19-recommandations-vaccination",
        component: path.join(__dirname, "./pages/EmptyPage/index.vue"),
        context: {
            beforeEnter(to, from, next) {
                window.open("/doc/covid-19-recommandations-vaccination.pdf");
                next(false);
            }
        }
    }
];

const redirects = [
    {
        path: "/landing",
        component: path.join(__dirname, "./pages/EmptyPage/index.vue"),
        context: {
            beforeEnter: (to, from, next) => {
                next("/");
            }
        }
    }
];

module.exports = [
    ...anonymousRoutes,
    ...loggedRoutes,
    ...fileRoutes,
    ...actionRoutes,
    ...redirects
];
