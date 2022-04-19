import Vue from "vue";
import VueRouter from "vue-router";
import store from "#app/store/index";
import { insert as insertNavigationLog } from "#helpers/api/navigationLogs";

import SignIn from "#app/pages/SignIn/index.vue";
import Contact from "#app/pages/Contact/index.vue";
import Invitation from "#app/pages/Invitation/index.vue";
import Dashboard from "#app/pages/Dashboard/Dashboard.vue";
import CartoPage from "#app/pages/CartoPage/CartoPage.vue";
import Launcher from "#app/pages/Launcher/Launcher.vue";
import TownsList from "#app/pages/TownsList/TownsList.vue";
import TownsCreate from "#app/pages/TownCreate/TownCreate.vue";
import TownsUpdate from "#app/pages/TownUpdate/TownUpdate.vue";
import TownsDetails from "#app/pages/TownDetails/TownDetails";
import UserList from "#app/pages/UserList/index.vue";
import UserCreate from "#app/pages/UserCreate/index.vue";
import UserActivate from "#app/pages/UserActivate/index.vue";
import UserValidate from "#app/pages/UserValidate/index.vue";
import UserUpgrade from "#app/pages/users.upgrade/users.upgrade.vue";
import UserRequestNewPassword from "#app/pages/UserRequestNewPassword/index.vue";
import UserSetNewPassword from "#app/pages/UserSetNewPassword/index.vue";
import PlanList from "#app/pages/PlanList/PlanList.vue";
import PlanCreate from "#app/pages/PlanCreate/PlanCreate.vue";
import PlanDetails from "#app/pages/PlanDetails/PlanDetails.vue";
import PlanEdit from "#app/pages/PlanUpdate/PlanUpdate.vue";
import PlanMarks from "#app/pages/PlanMarks/PlanMarks.vue";
import PrivateStats from "#app/pages/PrivateStats/index.vue";
import OrganizationDetails from "#app/pages/OrganizationDetails/index.vue";
import OrganizationList from "#app/pages/OrganizationList/index.vue";
import Covid from "#app/pages/CovidHistory/CovidHistory.vue";
import Changelog from "#app/pages/Changelog/Changelog.vue";
import CharteEngagement from "#app/pages/CharteEngagement/CharteEngagement.vue";
import History from "#app/pages/History/History.vue";
import Page404 from "#app/pages/404/404.vue";
import Account from "#app/pages/Account/index.vue";

function isLoggedIn() {
    return store.getters["user/loggedIn"];
}

function getConfig() {
    return store.state.config.configuration;
}

function isConfigLoaded() {
    return store.getters["config/loaded"] === true;
}

function hasPermission(...args) {
    return store.getters["config/hasPermission"](...args);
}

function hasAcceptedCharte() {
    return store.getters["config/hasAcceptedCharte"] === true;
}

function logNavigation(to) {
    insertNavigationLog({
        user_id: store.state.config.configuration.user.id,
        page: to
    });

    return true;
}

/**
 * This is the route towards which the user is redirected by the launcher page
 *
 * @var {Route|null}
 */
let entryPoint = null;

/**
 * @typedef {Object} Checker
 * @property {Function} checker The actual checker, that should return a boolean when called
 * @property {target}   string  The redirection path if the checker does not pass
 */

/**
 * Ensures that the given list of checkers pass before pursuing the routing
 *
 * Please @see Vue's official documentation about navigation guards:
 * https://router.vuejs.org/guide/advanced/navigation-guards.html#global-guards
 *
 * @param {Array.<Checker>} checkers
 * @param {Route}           to
 * @param {Route}           from
 * @param {Function}        next
 */
function guard(checkers, to, from, next) {
    for (let i = 0; i < checkers.length; i += 1) {
        const { checker, target, saveEntryPoint } = checkers[i];

        if (checker(to, from) !== true) {
            if (saveEntryPoint !== false) {
                entryPoint = to;
            }

            next(target);
            return;
        }
    }

    next();
}

/**
 * Checks if the current user has all required permissions to access the given route
 *
 * @param {Route} to
 *
 * @returns {boolean}
 */
function isPermitted(to) {
    const { permissions } = to.meta;

    // if there is no permission needed, access is obviously granted
    if (!permissions) {
        return true;
    }

    // ensure all permissions are given
    return permissions.every(permission => hasPermission(permission));
}

/**
 * Checks whether the current user has to upgrade his account before accessing any other page
 *
 * @returns {boolean}
 */
function isUpgraded() {
    const {
        user: { position }
    } = getConfig();
    return position !== "";
}

/**
 * Checks whether the user has an unread changelog pending
 *
 * @returns {boolean}
 */
function hasNoPendingChangelog() {
    const { changelog } = getConfig();
    return !changelog || changelog.length === 0;
}

/**
 * List of actual guards used by the routes below
 *
 * @type {Object.<string,Function>}
 */
const guardians = {
    anonymous: guard.bind(this, [
        { checker: () => !isLoggedIn(), target: "/", saveEntryPoint: false }
    ]),
    loggedIn: guard.bind(this, [
        { checker: isLoggedIn, target: "/connexion" },
        { checker: logNavigation }
    ]),
    loaded: guard.bind(this, [
        { checker: isLoggedIn, target: "/connexion" },
        { checker: isConfigLoaded, target: "/launcher" },
        { checker: isPermitted, target: "/", saveEntrypoint: false },
        { checker: logNavigation }
    ]),
    loadedAndUpgraded: guard.bind(this, [
        { checker: isLoggedIn, target: "/connexion" },
        { checker: isConfigLoaded, target: "/launcher" },
        { checker: isPermitted, target: "/", saveEntrypoint: false },
        { checker: hasAcceptedCharte, target: "/signature-charte-engagement" },
        { checker: isUpgraded, target: "/mise-a-niveau" },
        { checker: logNavigation }
    ]),
    loadedAndUpToDate: guard.bind(this, [
        { checker: isLoggedIn, target: "/connexion" },
        { checker: isConfigLoaded, target: "/launcher" },
        { checker: isPermitted, target: "/", saveEntrypoint: false },
        { checker: hasAcceptedCharte, target: "/signature-charte-engagement" },
        { checker: isUpgraded, target: "/mise-a-niveau" },
        { checker: hasNoPendingChangelog, target: "/nouvelle-version" },
        { checker: logNavigation }
    ])
};

/**
 * Returns the path to the homepage, depending on the user's status
 *
 * @returns {string}
 */
function home(to, from, next) {
    if (to.fullPath.substr(0, 2) === "/#") {
        return next(to.fullPath.substr(2));
    }

    if (isLoggedIn() !== true) {
        return next("/connexion");
    }

    if (isConfigLoaded() !== true) {
        return next("/launcher");
    }

    return next("/tableau-de-bord");
}

/**
 * Obviously, the routing configuration of the whole app
 */
const router = new VueRouter({
    mode: "history",
    scrollBehavior: (to, from, savedPosition) => {
        if (to.hash) {
            return {
                selector: to.hash
            };
        }

        if (savedPosition) {
            return savedPosition;
        }

        return {
            x: 0,
            y: 0
        };
    },
    routes: [
        {
            path: "/",
            beforeEnter: home,
            meta: {
                analyticsIgnore: true
            }
        },
        {
            path: "/connexion",
            component: SignIn,
            beforeEnter: guardians.anonymous,
            meta: {
                title: "Résorption-bidonvilles — Connexion"
            }
        },
        {
            path: "/contact",
            component: Contact,
            beforeEnter: guardians.anonymous,
            meta: {
                title: "Résorption-bidonvilles — Demande d'accès"
            }
        },
        {
            path: "/invitation",
            component: Invitation,
            meta: {
                title:
                    "Résorption-bidonvilles — Inviter à rejoindre la plateforme"
            }
        },
        {
            path: "/launcher",
            component: Launcher,
            beforeEnter: guardians.loggedIn,
            meta: {
                title: "Résorption-bidonvilles — Chargement"
            }
        },
        {
            path: "/nouvelle-version",
            component: Changelog,
            beforeEnter: guardians.loadedAndUpgraded,
            meta: {
                title:
                    "Résorption-bidonvilles — Une nouvelle version est disponible"
            }
        },
        {
            path: "/deconnexion",
            beforeEnter: (to, from, next) => {
                store.dispatch("user/logout", Vue.prototype.$piwik).then(() => {
                    next("/");
                });
            },
            meta: {
                analyticsIgnore: true
            }
        },
        {
            meta: {
                group: "townList",
                title: "Résorption-bidonvilles — Carte des sites"
            },
            path: "/cartographie",
            component: CartoPage,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "townList",
                title: "Résorption-bidonvilles — Liste des sites"
            },
            path: "/liste-des-sites",
            component: TownsList,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "townCreation",
                permissions: ["shantytown.create"],
                title: "Résorption-bidonvilles — Déclarer un site"
            },
            path: "/nouveau-site",
            component: TownsCreate,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "townList",
                title: "Résorption-bidonvilles — Fiche de site"
            },
            path: "/site/:id",
            component: TownsDetails,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "townList",
                title: "Résorption-bidonvilles — Mise à jour de site"
            },
            path: "/site/:id/mise-a-jour",
            component: TownsUpdate,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            path: "/feedback",
            beforeEnter(to, from, next) {
                window.location.href =
                    "mailto:contact@resorption-bidonvilles.beta.gouv.fr";
                next(false);
            }
        },
        {
            path: "/conditions-d-utilisation",
            beforeEnter(to, from, next) {
                window.open("/doc/CGU_2021_04_08.pdf");
                next(false);
            }
        },
        {
            path: "/typologie-des-acces",
            beforeEnter(to, from, next) {
                window.open("/doc/guide_de_l_administrateur.pdf");
                next(false);
            }
        },
        {
            path: "/charte-d-engagement",
            beforeEnter(to, from, next) {
                const {
                    version_charte_engagement: { fichier }
                } = getConfig();
                window.open(fichier, "_blank");
                next(false);
            }
        },
        {
            meta: {
                group: "account",
                title: "Résorption-bidonvilles — Gestion de mon compte"
            },
            path: "/mon-compte",
            component: Account,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                title: "Résorption-bidonvilles — Fiche d'un utilisateur"
            },
            path: "/utilisateur/:id",
            component: Account,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "users",
                permissions: ["user.list"],
                title: "Résorption-bidonvilles — Liste des utilisateurs"
            },
            path: "/liste-des-utilisateurs",
            component: UserList,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "userCreation",
                permissions: ["user.create"],
                title: "Résorption-bidonvilles — Créer un utilisateur"
            },
            path: "/nouvel-utilisateur",
            component: UserCreate,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                title: "Résorption-bidonvilles — Charte d'engagement"
            },
            path: "/signature-charte-engagement",
            component: CharteEngagement,
            beforeEnter: guard.bind(this, [
                { checker: isLoggedIn, target: "/connexion" },
                { checker: isConfigLoaded, target: "/launcher" },
                { checker: isPermitted, target: "/", saveEntrypoint: false },
                {
                    checker() {
                        return !hasAcceptedCharte();
                    },
                    target: "/"
                }
            ])
        },
        {
            meta: {
                group: "users",
                permissions: ["user.activate"],
                title: "Résorption-bidonvilles — Fiche de demande d'accès"
            },
            path: "/nouvel-utilisateur/:id",
            component: UserValidate,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "users",
                title: "Résorption-bidonvilles — Mise à niveau de votre compte"
            },
            path: "/mise-a-niveau",
            component: UserUpgrade,
            beforeEnter: guardians.loaded
        },
        {
            meta: {
                group: "users",
                title:
                    "Résorption-bidonvilles — Demande de nouveau mot de passe"
            },
            path: "/nouveau-mot-de-passe",
            component: UserRequestNewPassword,
            beforeEnter: guardians.anonymous
        },
        {
            meta: {
                group: "users",
                title:
                    "Résorption-bidonvilles — Réinitialisation de mon mot de passe"
            },
            path: "/renouveler-mot-de-passe/:token",
            component: UserSetNewPassword,
            beforeEnter: guardians.anonymous
        },
        {
            meta: {
                group: "account",
                title: "Résorption-bidonvilles — Activation de mon compte"
            },
            path: "/activer-mon-compte/:token",
            component: UserActivate,
            beforeEnter: guardians.anonymous
        },
        {
            meta: {
                title: "Résorption-bidonvilles — Liste des actions",
                group: "plans",
                permissions: ["plan.list"]
            },
            path: "/liste-des-actions",
            component: PlanList,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            path: "/liste-des-dispositifs",
            redirect: "/liste-des-actions"
        },
        {
            meta: {
                title: "Résorption-bidonvilles — Déclarer une action",
                group: "plans",
                permissions: ["plan.create"]
            },
            path: "/nouvelle-action",
            component: PlanCreate,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            path: "/nouveau-dispositif",
            redirect: "/nouvelle-action"
        },
        {
            meta: {
                title: "Résorption-bidonvilles — Modifier une action",
                group: "plans",
                permissions: ["plan.update"]
            },
            path: "/modifier-action/:id",
            component: PlanEdit,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            path: "/modifier-dispositif/:id",
            redirect: to => ({
                path: "/modifier-action/:id",
                params: {
                    id: to.params.id
                }
            })
        },
        {
            meta: {
                title: "Résorption-bidonvilles — Fiche d'une action",
                group: "plans",
                permissions: ["plan.read"]
            },
            path: "/action/:id",
            component: PlanDetails,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            path: "/dispositif/:id",
            redirect: to => ({
                path: "/action/:id",
                params: {
                    id: to.params.id
                }
            })
        },
        {
            meta: {
                title:
                    "Résorption-bidonvilles — Saisir les indicateurs d'une action",
                group: "plans",
                permissions: ["plan.updateMarks"]
            },
            path: "/action/:id/indicateurs",
            component: PlanMarks,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            path: "/dispositif/:id/indicateurs",
            redirect: to => ({
                path: "/action/:id/indicateurs",
                params: {
                    id: to.params.id
                }
            })
        },
        {
            path: "/statistiques/:code?",
            meta: {
                title: "Résorption-bidonvilles — Statistiques",
                group: "stats",
                permissions: ["stats.read"]
            },
            component: PrivateStats,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            path: "/activites",
            meta: {
                title: "Résorption-bidonvilles — Historique des activités",
                group: "history",
                permissions: ["shantytown.list"]
            },
            component: History,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            path: "/activites/:locationType/:locationCode?",
            meta: {
                title: "Résorption-bidonvilles — Historique des activités",
                group: "history",
                permissions: ["shantytown.list"]
            },
            component: History,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                title: "Résorption-bidonvilles — COVID-19",
                group: "covid"
            },
            path: "/covid-19",
            component: Covid,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                title: "Résorption-bidonvilles — Annuaire",
                group: "directory"
            },
            path: "/annuaire/",
            component: OrganizationList,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                title: "Résorption-bidonvilles — Fiche d'annuaire",
                group: "directory"
            },
            path: "/annuaire/:id",
            component: OrganizationDetails,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                title: "Résorption-bidonvilles — Tableau de bord",
                group: "dashboard"
            },
            path: "/tableau-de-bord",
            component: Dashboard,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            path: "/fiches-hebergement-logement-adapte",
            beforeEnter(to, from, next) {
                window.open("/doc/fiches-hebergement-logement-adapte.pdf");
                next(false);
            }
        },
        {
            path: "/fiche-bidonvilles-maraudes",
            beforeEnter(to, from, next) {
                window.open("/doc/fiche-bidonvilles-maraudes.pdf");
                next(false);
            }
        },
        {
            path: "/covid-19-recommandations-vaccination",
            beforeEnter(to, from, next) {
                window.open("/doc/covid-19-recommandations-vaccination.pdf");
                next(false);
            }
        },
        {
            path: "/404",
            meta: {
                title: "Résorption-bidonvilles — Page introuvable"
            },
            component: Page404
        },
        {
            path: "*",
            redirect: "/404"
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.substr(0, 2) === "/#") {
        next(to.fullPath.substr(2));
        return;
    }

    next();
});

export { router };

/**
 * Returns the entrypoint
 *
 * Please @see the documentation for entrypoint.
 * If no entrypoint is defined, defaults to home (/).
 *
 * @returns {string}
 */
export function getEntryPoint() {
    if (entryPoint === null) {
        return "/";
    }

    // the entryPoint is consumed once only
    const response = entryPoint;
    entryPoint = null;
    return response;
}
