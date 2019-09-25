import VueRouter from 'vue-router';

import Landing from '#app/pages/landing/landing.vue';
import SignIn from '#app/pages/signin/signin.vue';
import SignUp from '#app/pages/signup/signup.vue';
import TownsExplorer from '#app/pages/townExplorer/explorer.vue';
import Launcher from '#app/pages/launcher/launcher.vue';
import AddTown from '#app/pages/addTown/addTown.vue';
import Town from '#app/pages/town/town.vue';
import ShantytownCommentList from '#app/pages/shantytownComment.list/shantytownComment.list.vue';
import Me from '#app/pages/me/me.vue';
import UserList from '#app/pages/users.list/users.list.vue';
import UserCreate from '#app/pages/users.create/users.create.vue';
import UserActivate from '#app/pages/users.activate/users.activate.vue';
import UserValidate from '#app/pages/users.validate/users.validate.vue';
import UserUpgrade from '#app/pages/users.upgrade/users.upgrade.vue';
import UserRequestNewPassword from '#app/pages/users.requestNewPassword/users.requestNewPassword.vue';
import UserSetNewPassword from '#app/pages/users.setNewPassword/users.setNewPassword.vue';
import PlanList from '#app/pages/plans.list/plans.list.vue';
import PlanCreate from '#app/pages/plans.create/plans.create.vue';
import PlanDetails from '#app/pages/plans.details/plans.details.vue';
import Statistics from '#app/pages/stats/stats.vue';
import LegalMentions from '#app/pages/legalMentions/legalMentions.vue';
// eslint-disable-next-line
import CGU from '/doc/CGU_Resorption_Bidonvilles.pdf';
// eslint-disable-next-line
import TypologieAcces from '/doc/droits_d_acces_et_guide_de_l_administrateur_local.pdf';

import { logout, isLoggedIn, alreadyLoggedBefore } from '#helpers/api/user';
import { get as getConfig, isLoaded as isConfigLoaded, hasPermission } from '#helpers/api/config';

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
function hasToUpgrade() {
    const { user: { position } } = getConfig();
    return position !== '';
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
        { checker: isConfigLoaded, target: '/launcher' },
        { checker: isPermitted, target: '/', saveEntrypoint: false },
    ]),
    loadedAndUpgraded: guard.bind(this, [
        { checker: isLoggedIn, target: '/connexion' },
        { checker: isConfigLoaded, target: '/launcher' },
        { checker: isPermitted, target: '/', saveEntrypoint: false },
        { checker: hasToUpgrade, target: '/mise-a-niveau' },
    ]),
};

/**
 * Returns the path to the homepage, depending on the user's status
 *
 * @returns {string}
 */
function home() {
    if (isLoggedIn() !== true) {
        if (alreadyLoggedBefore()) {
            return '/connexion';
        }

        return '/landing';
    }

    if (isConfigLoaded() !== true) {
        return '/launcher';
    }

    return '/liste-des-sites';
}

/**
 * Obviously, the routing configuration of the whole app
 */
const router = new VueRouter({
    scrollBehavior: (to) => {
        if (to.hash) {
            return {
                selector: to.hash,
            };
        }

        return {
            x: 0,
            y: 0,
        };
    },
    routes: [
        {
            path: '/',
            redirect: home,
            meta: {
                analyticsIgnore: true,
            },
        },
        {
            path: '/landing',
            component: Landing,
            beforeEnter: guardians.anonymous,
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
            path: '/launcher',
            component: Launcher,
            beforeEnter: guardians.loggedIn,
        },
        {
            path: '/deconnexion',
            beforeEnter: (to, from, next) => {
                logout();
                next('/');
            },
            meta: {
                analyticsIgnore: true,
            },
        },
        {
            meta: {
                group: 'townList',
            },
            path: '/liste-des-sites',
            component: TownsExplorer,
            beforeEnter: guardians.loadedAndUpgraded,
        },
        {
            meta: {
                group: 'townCreation',
                permissions: ['shantytown.create'],
            },
            path: '/nouveau-site',
            component: AddTown,
            beforeEnter: guardians.loadedAndUpgraded,
        },
        {
            meta: {
                group: 'townList',
            },
            path: '/site/:id',
            component: Town,
            beforeEnter: guardians.loadedAndUpgraded,
        },
        {
            path: '/feedback',
            beforeEnter(to, from, next) {
                window.open('https://docs.google.com/forms/d/e/1FAIpQLSdffCEgWp2B1F770MsquDXbyqs251fleRBJLA3vlkQ-N78w9g/viewform', '_blank');
                next(false);
            },
        },
        {
            path: '/aide',
            beforeEnter(to, from, next) {
                window.open('https://action-bidonvilles.helpsite.com/', '_blank');
                next(false);
            },
        },
        {
            path: '/conditions-d-utilisation',
            beforeEnter(to, from, next) {
                window.open(CGU, '_blank');
                next(false);
            },
        },
        {
            path: '/typologie-des-acces',
            beforeEnter(to, from, next) {
                window.open(TypologieAcces, '_blank');
                next(false);
            },
        },
        {
            path: '/mentions-legales',
            component: LegalMentions,
        },
        {
            meta: {
                group: 'account',
            },
            path: '/mon-compte',
            component: Me,
            beforeEnter: guardians.loadedAndUpgraded,
        },
        {
            meta: {
                group: 'users',
                permissions: ['user.list'],
            },
            path: '/liste-des-utilisateurs',
            component: UserList,
            beforeEnter: guardians.loadedAndUpgraded,
        },
        {
            meta: {
                group: 'userCreation',
                permissions: ['user.create'],
            },
            path: '/nouvel-utilisateur',
            component: UserCreate,
            beforeEnter: guardians.loadedAndUpgraded,
        },
        {
            meta: {
                group: 'users',
                permissions: ['user.activate'],
            },
            path: '/nouvel-utilisateur/:id',
            component: UserValidate,
            beforeEnter: guardians.loadedAndUpgraded,
        },
        {
            meta: {
                group: 'users',
            },
            path: '/mise-a-niveau',
            component: UserUpgrade,
            beforeEnter: guardians.loaded,
        },
        {
            meta: {
                group: 'users',
            },
            path: '/nouveau-mot-de-passe',
            component: UserRequestNewPassword,
            beforeEnter: guardians.anonymous,
        },
        {
            meta: {
                group: 'users',
            },
            path: '/renouveler-mot-de-passe/:token',
            component: UserSetNewPassword,
            beforeEnter: guardians.anonymous,
        },
        {
            meta: {
                group: 'account',
            },
            path: '/activer-mon-compte/:token',
            component: UserActivate,
            beforeEnter: guardians.anonymous,
        },
        {
            meta: {
                group: 'plans',
                permissions: ['plan.list'],
            },
            path: '/liste-des-dispositifs',
            component: PlanList,
            beforeEnter: guardians.loadedAndUpgraded,
        },
        {
            meta: {
                group: 'planCreation',
                permissions: ['plan.create'],
            },
            path: '/nouveau-dispositif',
            component: PlanCreate,
            beforeEnter: guardians.loadedAndUpgraded,
        },
        {
            meta: {
                group: 'plans',
                permissions: ['plan.read'],
            },
            path: '/dispositif/:id',
            component: PlanDetails,
            beforeEnter: guardians.loadedAndUpgraded,
        },
        {
            meta: {
                group: 'admin',
                permissions: ['stats.read'],
            },
            path: '/statistiques',
            component: Statistics,
            beforeEnter: guardians.loadedAndUpgraded,
        },
        {
            meta: {
                group: 'admin',
                permissions: ['shantytown_comment.moderate'],
            },
            path: '/moderation-commentaires',
            component: ShantytownCommentList,
            beforeEnter: guardians.loadedAndUpgraded,
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
