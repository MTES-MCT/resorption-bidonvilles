import Vue from "vue";
import VueRouter from "vue-router";

import LandingPage from "#app/pages/LandingPage/index.vue";
import SignIn from "#app/pages/signin/signin.vue";
import Contact from "#app/pages/Contact/index.vue";
import Dashboard from "#app/pages/dashboard/dashboard.vue";
import Launcher from "#app/pages/launcher/launcher.vue";
import TownsList from "#app/pages/towns.list/towns.list.vue";
import TownsCreate from "#app/pages/towns.create/towns.create.vue";
import TownsDetails from "#app/pages/towns.details/towns.details.vue";
import Me from "#app/pages/me/me.vue";
import UserList from "#app/pages/users.list/users.list.vue";
import UserCreate from "#app/pages/users.create/users.create.vue";
import UserActivate from "#app/pages/users.activate/users.activate.vue";
import UserValidate from "#app/pages/users.validate/users.validate.vue";
import UserUpgrade from "#app/pages/users.upgrade/users.upgrade.vue";
import UserRequestNewPassword from "#app/pages/users.requestNewPassword/users.requestNewPassword.vue";
import UserSetNewPassword from "#app/pages/users.setNewPassword/users.setNewPassword.vue";
import PlanList from "#app/pages/plans.list/plans.list.vue";
import PlanCreate from "#app/pages/plans.create/plans.create.vue";
import PlanDetails from "#app/pages/plans.details/plans.details.vue";
import PlanEdit from "#app/pages/plans.edit/plans.edit.vue";
import PlanMarks from "#app/pages/plans.marks/plans.marks.vue";
import Statistics from "#app/pages/stats/stats.vue";
import LegalMentions from "#app/pages/legalMentions/legalMentions.vue";
import Directory from "#app/pages/directory/directory.vue";
import UserActivityList from "#app/pages/userActivity.list/userActivity.list.vue";
import PublicStats from "#app/pages/PublicStats/index.vue";
import Covid from "#app/pages/covid/covid.vue";
import Changelog from "#app/pages/changelog/changelog.vue";
import CharteEngagement from "#app/pages/charte_engagement/charte_engagement.vue";

import { logout, isLoggedIn, alreadyLoggedBefore } from "#helpers/api/user";
import {
    get as getConfig,
    isLoaded as isConfigLoaded,
    hasPermission,
    hasAcceptedCharte
} from "#helpers/api/config";

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
    return changelog === null;
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
    loggedIn: guard.bind(this, [{ checker: isLoggedIn, target: "/connexion" }]),
    loaded: guard.bind(this, [
        { checker: isLoggedIn, target: "/connexion" },
        { checker: isConfigLoaded, target: "/launcher" },
        { checker: isPermitted, target: "/", saveEntrypoint: false }
    ]),
    loadedAndUpgraded: guard.bind(this, [
        { checker: isLoggedIn, target: "/connexion" },
        { checker: isConfigLoaded, target: "/launcher" },
        { checker: isPermitted, target: "/", saveEntrypoint: false },
        { checker: hasAcceptedCharte, target: "/signature-charte-engagement" },
        { checker: isUpgraded, target: "/mise-a-niveau" }
    ]),
    loadedAndUpToDate: guard.bind(this, [
        { checker: isLoggedIn, target: "/connexion" },
        { checker: isConfigLoaded, target: "/launcher" },
        { checker: isPermitted, target: "/", saveEntrypoint: false },
        { checker: hasAcceptedCharte, target: "/signature-charte-engagement" },
        { checker: isUpgraded, target: "/mise-a-niveau" },
        { checker: hasNoPendingChangelog, target: "/nouvelle-version" }
    ])
};

/**
 * Returns the path to the homepage, depending on the user's status
 *
 * @returns {string}
 */
function home() {
    if (isLoggedIn() !== true) {
        if (alreadyLoggedBefore()) {
            return "/connexion";
        }

        return "/landing";
    }

    if (isConfigLoaded() !== true) {
        return "/launcher";
    }

    return "/cartographie";
}

/**
 * Obviously, the routing configuration of the whole app
 */
const router = new VueRouter({
    scrollBehavior: to => {
        if (to.hash) {
            return {
                selector: to.hash
            };
        }

        return {
            x: 0,
            y: 0
        };
    },
    routes: [
        {
            path: "/",
            redirect: home,
            meta: {
                analyticsIgnore: true
            }
        },
        {
            path: "/landing",
            component: LandingPage,
            beforeEnter: guardians.anonymous
        },
        {
            path: "/statistiques-publiques",
            component: PublicStats,
            beforeEnter: guardians.anonymous
        },
        {
            path: "/connexion",
            component: SignIn,
            beforeEnter: guardians.anonymous
        },
        {
            path: "/contact",
            component: Contact,
            beforeEnter: guardians.anonymous
        },
        {
            path: "/launcher",
            component: Launcher,
            beforeEnter: guardians.loggedIn
        },
        {
            path: "/nouvelle-version",
            component: Changelog,
            beforeEnter: guardians.loadedAndUpgraded
        },
        {
            path: "/deconnexion",
            beforeEnter: (to, from, next) => {
                logout(Vue.prototype.$piwik);
                next("/");
            },
            meta: {
                analyticsIgnore: true
            }
        },
        {
            meta: {
                group: "townList"
            },
            path: "/cartographie",
            component: Dashboard,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "townList"
            },
            path: "/liste-des-sites",
            component: TownsList,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "townCreation",
                permissions: ["shantytown.create"]
            },
            path: "/nouveau-site",
            component: TownsCreate,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "townList"
            },
            path: "/site/:id",
            component: TownsDetails,
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
                window.open("/doc/CGU_Resorption_Bidonvilles.pdf");
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
            path: "/mentions-legales",
            component: LegalMentions
        },
        {
            meta: {
                group: "account"
            },
            path: "/mon-compte",
            component: Me,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "users",
                permissions: ["user.list"]
            },
            path: "/liste-des-utilisateurs",
            component: UserList,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "userCreation",
                permissions: ["user.create"]
            },
            path: "/nouvel-utilisateur",
            component: UserCreate,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
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
                permissions: ["user.activate"]
            },
            path: "/nouvel-utilisateur/:id",
            component: UserValidate,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "users"
            },
            path: "/mise-a-niveau",
            component: UserUpgrade,
            beforeEnter: guardians.loaded
        },
        {
            meta: {
                group: "users"
            },
            path: "/nouveau-mot-de-passe",
            component: UserRequestNewPassword,
            beforeEnter: guardians.anonymous
        },
        {
            meta: {
                group: "users"
            },
            path: "/renouveler-mot-de-passe/:token",
            component: UserSetNewPassword,
            beforeEnter: guardians.anonymous
        },
        {
            meta: {
                group: "account"
            },
            path: "/activer-mon-compte/:token",
            component: UserActivate,
            beforeEnter: guardians.anonymous
        },
        {
            meta: {
                group: "plans",
                permissions: ["plan.list"]
            },
            path: "/liste-des-dispositifs",
            component: PlanList,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "plans",
                permissions: ["plan.create"]
            },
            path: "/nouveau-dispositif",
            component: PlanCreate,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "plans",
                permissions: ["plan.update"]
            },
            path: "/modifier-dispositif/:id",
            component: PlanEdit,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "plans",
                permissions: ["plan.read"]
            },
            path: "/dispositif/:id",
            component: PlanDetails,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "plans",
                permissions: ["plan.updateMarks"]
            },
            path: "/dispositif/:id/indicateurs",
            component: PlanMarks,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "admin",
                permissions: ["stats.read"]
            },
            path: "/statistiques",
            component: Statistics,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "admin",
                permissions: ["shantytown_comment.moderate"]
            },
            path: "/historique-des-activites",
            component: UserActivityList,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "covid"
            },
            path: "/covid-19",
            component: Covid,
            beforeEnter: guardians.loadedAndUpToDate
        },
        {
            meta: {
                group: "directory"
            },
            path: "/annuaire/:id?",
            component: Directory,
            beforeEnter: guardians.loadedAndUpToDate
        }
    ]
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
