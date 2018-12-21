import VueRouter from 'vue-router';

import SignIn from '#app/pages/signin/signin.vue';
import SignUp from '#app/pages/signup/signup.vue';
import TownsExplorer from '#app/pages/townExplorer/explorer.vue';
import Landing from '#app/pages/landing/landing.vue';

import { isLoggedIn } from '#helpers/userHelper';
import { isLoaded as isConfigLoaded } from '#helpers/configHelper';

/**
 * This is the route towards which the user is redirected by the landing page
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

        if (checker() !== true) {
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
 * List of actual guards used by the routes below
 *
 * @type {Object.<string,Function>}
 */
const guardians = {
    anonymous: guard.bind(this, [
        { checker: () => !isLoggedIn(), target: '/', saveEntryPoint: false },
    ]),
    loggedIn: guard.bind(this, [
        { checker: isLoggedIn, target: '/connexion' },
    ]),
    loaded: guard.bind(this, [
        { checker: isLoggedIn, target: '/connexion' },
        { checker: isConfigLoaded, target: '/landing' },
    ]),
};

/**
 * Returns the path to the homepage, depending on the user's status
 *
 * @returns {string}
 */
function home() {
    if (isLoggedIn() !== true) {
        return '/connexion';
    }

    if (isConfigLoaded() !== true) {
        return '/landing';
    }

    return '/liste-des-sites';
}

/**
 * Obviously, the routing configuration of the whole app
 */
const router = new VueRouter({
    linkExactActiveClass: 'active',
    routes: [
        {
            path: '/',
            redirect: home,
        },
        {
            path: '/connexion',
            component: SignIn,
            beforeEnter: guardians.anonymous,
        },
        {
            path: '/demande-d-acces',
            component: SignUp,
            beforeEnter: guardians.anonymous,
        },
        {
            path: '/landing',
            component: Landing,
            beforeEnter: guardians.loggedIn,
        },
        {
            path: '/liste-des-sites',
            component: TownsExplorer,
            beforeEnter: guardians.loaded,
        },
    ],
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
        return '/';
    }

    // the entryPoint is consumed once only
    const response = entryPoint;
    entryPoint = null;
    return response;
}
