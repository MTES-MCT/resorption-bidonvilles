import VueRouter from "vue-router";
import Signin from "#src/js/pages/Signin.vue";
import TownsList from "#src/js/pages/TownsList/MobileTownsList.vue";
import Launcher from "#src/js/pages/Launcher/Launcher.vue";
import Logout from "#src/js/pages/Logout/Logout.vue";
import store from "../store/index";

function isLoggedIn() {
  return store.getters["user/loggedIn"];
}

function getConfig() {
  return store.state.config.configuration;
}

function isConfigLoaded() {
  return store.getters["config/loaded"] === true;
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
  if (to.fullPath.substr(0, 2) === "/#") {
    return next(to.fullPath.substr(2));
  }

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
    { checker: () => !isLoggedIn(), target: "/", saveEntryPoint: false },
  ]),
  loggedIn: guard.bind(this, [{ checker: isLoggedIn, target: "/connexion" }]),
  loaded: guard.bind(this, [
    { checker: isLoggedIn, target: "/connexion" },
    { checker: isConfigLoaded, target: "/launcher" },
    { checker: isPermitted, target: "/", saveEntrypoint: false },
  ]),
  loadedAndUpgraded: guard.bind(this, [
    { checker: isLoggedIn, target: "/connexion" },
    { checker: isConfigLoaded, target: "/launcher" },
    { checker: isPermitted, target: "/", saveEntrypoint: false },
    { checker: hasAcceptedCharte, target: "/signature-charte-engagement" },
    { checker: isUpgraded, target: "/mise-a-niveau" },
  ]),
  loadedAndUpToDate: guard.bind(this, [
    { checker: isLoggedIn, target: "/connexion" },
    { checker: isConfigLoaded, target: "/launcher" },
    { checker: isPermitted, target: "/", saveEntrypoint: false },
    { checker: hasAcceptedCharte, target: "/signature-charte-engagement" },
    { checker: isUpgraded, target: "/mise-a-niveau" },
    { checker: hasNoPendingChangelog, target: "/nouvelle-version" },
  ]),
};

export default new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      beforeEnter: home,
      meta: {
        analyticsIgnore: true,
      },
    },
    {
      path: "/connexion",
      component: Signin,
      // beforeEnter: guardians.anonymous,
      meta: {
        title: "Résorption-bidonvilles — Connexion",
      },
    },
    {
      path: "/launcher",
      component: Launcher,
      // beforeEnter: guardians.loggedIn,
      meta: {
        title: "Résorption-bidonvilles — Chargement",
      },
    },
    {
      path: "/liste-des-sites",
      component: TownsList,
      beforeEnter: guardians.loadedAndUpToDate,
    },
    {
      path: "/deconnexion",
      component: Logout,
      meta: {
        analyticsIgnore: true,
      },
    },
  ],
});

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
