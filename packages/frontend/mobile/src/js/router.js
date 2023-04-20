import { createRouter, createWebHistory } from "vue-router";
import Signin from "#src/js/pages/Signin.vue";
import TownsList from "#src/js/pages/TownsList/MobileTownsList.vue";
import TownPage from "#src/js/pages/TownPage/TownPage.vue";
import TownsSearch from "#src/js/pages/TownsSearch/TownsSearch.vue";
import Launcher from "#src/js/pages/Launcher/Launcher.vue";
import Logout from "#src/js/pages/Logout/Logout.vue";
import MiseAJourSectionDeSite from "#src/js/pages/MiseAJourSectionDeSite/MiseAJourSectionDeSite.vue";
import MiseANiveau from "#src/js/pages/MiseANiveau/MiseANiveau.vue";
import NotesList from "#src/js/pages/NotesList/NotesList.vue";
import NotesForm from "#src/js/pages/NotesForm/NotesForm.vue";
import QuestionnaireSatisfaction from "#src/js/pages/QuestionnaireSatisfaction/QuestionnaireSatisfaction.vue";
import SignatureCharteEngagement from "#src/js/pages/SignatureCharteEngagement/SignatureCharteEngagement.vue";
import store from "#src/store/index.js";
import { insert as insertNavigationLog } from "./helpers/navigationLogs";

function isLoggedIn() {
    return store.getters["user/loggedIn"];
}

function getConfig() {
    return store.state.config.configuration;
}

function isConfigLoaded() {
    return store.getters["config/loaded"] === true;
}

function logNavigation(to, from) {
    let origin;
    if (/^\/site\/[0-9]+\/?[?#]?/.test(to.path)) {
        origin = from.meta.origin;
        if (from.path === "/launcher") {
            origin = "acces_direct";
        }

        if (!origin) {
            return;
        }
    }

    insertNavigationLog(to.path, origin);
    return true;
}

/**
 * This is the route towards which the user is redirected by the launcher page
 *
 * @var {Route|null}
 */
let entryPoint = null;

/**
 * Returns the path to the homepage, depending on the user's status
 *
 * @returns {string}
 */

function home(to, from, next) {
    if (isLoggedIn() !== true) {
        return next("/connexion");
    }

    if (isConfigLoaded() !== true) {
        return next("/launcher");
    }

    return next("/liste-des-sites");
}

function hasPermission(...args) {
    return store.getters["config/hasPermission"](...args);
}

function hasAcceptedCharte() {
    return store.getters["config/hasAcceptedCharte"] === true;
}

function saveTabNavigation(to) {
    if (to.meta.tab) {
        store.commit("navigation/SET_TAB", {
            tab: to.meta.tab,
            page: to.path,
        });
    }

    return true;
}

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
    return permissions.every((permission) => hasPermission(permission));
}

/**
 * Checks whether the current user has to upgrade his account before accessing any other page
 *
 * @returns {boolean}
 */
function isUpgraded() {
    const {
        user: { position },
    } = getConfig();
    return position !== "";
}

/**
 * List of actual guards used by the routes below
 *
 * @type {Object.<string,Function>}
 */
const guardians = {
    anonymous: guard.bind(this, [
        { checker: () => !isLoggedIn(), target: "/", saveEntryPoint: false },
    ]),
    loggedIn: guard.bind(this, [
        { checker: isLoggedIn, target: "/connexion" },
        { checker: saveTabNavigation },
    ]),
    loaded: guard.bind(this, [
        { checker: isLoggedIn, target: "/connexion" },
        { checker: isConfigLoaded, target: "/launcher" },
        { checker: isPermitted, target: "/", saveEntrypoint: false },
        { checker: saveTabNavigation },
    ]),
    loadedAndUpgraded: guard.bind(this, [
        { checker: isLoggedIn, target: "/connexion" },
        { checker: isConfigLoaded, target: "/launcher" },
        { checker: isPermitted, target: "/", saveEntrypoint: false },
        { checker: hasAcceptedCharte, target: "/signature-charte-engagement" },
        { checker: isUpgraded, target: "/mise-a-niveau" },
        { checker: saveTabNavigation },
        { checker: logNavigation },
    ]),
    loadedAndUpToDate: guard.bind(this, [
        { checker: isLoggedIn, target: "/connexion" },
        { checker: isConfigLoaded, target: "/launcher" },
        { checker: isPermitted, target: "/", saveEntrypoint: false },
        { checker: hasAcceptedCharte, target: "/signature-charte-engagement" },
        { checker: isUpgraded, target: "/mise-a-niveau" },
        { checker: saveTabNavigation },
        { checker: logNavigation },
    ]),
};

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: "/",
            beforeEnter: home,
            component: Launcher,
            meta: {
                analyticsIgnore: true,
            },
        },
        {
            path: "/connexion",
            component: Signin,
            beforeEnter: guardians.anonymous,
            meta: {
                title: "Résorption-bidonvilles — Connexion",
            },
        },
        {
            path: "/launcher",
            component: Launcher,
            beforeEnter: guardians.loggedIn,
            meta: {
                title: "Résorption-bidonvilles — Chargement",
            },
        },
        {
            meta: {
                tab: "sites",
                title: "Résorption-bidonvilles — Liste des sites",
            },
            path: "/liste-des-sites",
            component: TownsList,
            beforeEnter: guardians.loadedAndUpToDate,
        },
        {
            path: "/questionnaire-de-satisfaction",
            component: QuestionnaireSatisfaction,
            beforeEnter: guardians.loadedAndUpToDate,
        },
        {
            path: "/recherche-de-site",
            component: TownsSearch,
            beforeEnter: guardians.loadedAndUpToDate,
        },
        {
            meta: {
                tab: "notes",
                title: "Résorption-bidonvilles — Liste des notes",
            },
            path: "/liste-des-notes",
            component: NotesList,
            beforeEnter: guardians.loadedAndUpToDate,
        },
        {
            meta: {
                tab: "notes",
                title: "Résorption-bidonvilles — Rédaction d'une note",
            },
            path: "/notes/:id",
            component: NotesForm,
            beforeEnter: guardians.loadedAndUpToDate,
        },
        {
            path: "/deconnexion",
            component: Logout,
            meta: {
                analyticsIgnore: true,
            },
        },
        {
            meta: {
                tab: "sites",
                title: "Résorption-bidonvilles — Fiche de site",
            },
            path: "/site/:id",
            component: TownPage,
            beforeEnter: guardians.loadedAndUpToDate,
        },
        {
            meta: {
                tab: "sites",
                title: "Résorption-bidonvilles — Modification de site",
            },
            path: "/site/:id/mise-a-jour/:section_id",
            component: MiseAJourSectionDeSite,
            beforeEnter: guardians.loadedAndUpToDate,
        },
        {
            meta: {
                title: "Résorption-bidonvilles — Charte d'engagement",
            },
            path: "/signature-charte-engagement",
            component: SignatureCharteEngagement,
            beforeEnter: guardians.loaded,
        },
        {
            meta: {
                title: "Résorption-bidonvilles — Mise à niveau",
            },
            path: "/mise-a-niveau",
            component: MiseANiveau,
            beforeEnter: guardians.loaded,
        },
    ],
});

export default router;

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
