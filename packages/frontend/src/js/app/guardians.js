import { alreadyLoggedBefore, isLoggedIn } from "#helpers/api/user";
import {
    get as getConfig,
    hasAcceptedCharte,
    hasPermission,
    isLoaded as isConfigLoaded
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
    console.log({ checkers, to, from, next });

    for (let i = 0; i < checkers.length; i += 1) {
        const { checker, target, saveEntryPoint } = checkers[i];

        if (checker(to, from) !== true) {
            if (saveEntryPoint !== false) {
                entryPoint = to;
            }

            console.log("next", target);

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
    console.log("isPermitted", to);

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
    console.log("hasNoPending");
    const { changelog } = getConfig();
    return !changelog || changelog.length === 0;
}

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
    ]),
    signatureCharte: guard.bind(this, [
        { checker: isLoggedIn, target: "/connexion" },
        { checker: isConfigLoaded, target: "/launcher" },
        { checker: isPermitted, target: "/", saveEntrypoint: false },
        {
            checker() {
                return !hasAcceptedCharte();
            },
            target: "/"
        }
    ]),
    home: (to, from, next) => {
        if (to.fullPath.substr(0, 2) === "/#") {
            return next(to.fullPath.substr(2));
        }

        if (isLoggedIn() !== true) {
            if (alreadyLoggedBefore()) {
                return next("/connexion");
            }

            return next();
        }

        if (isConfigLoaded() !== true) {
            return next("/launcher");
        }

        return next("/cartographie");
    }
};

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

export default guardians;
