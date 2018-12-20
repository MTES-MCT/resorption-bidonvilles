// load the whole betagouv template
import 'template.data.gouv.fr/dist/style/main.css';
import '../css/index.scss';

// import polyfills
import '@babel/polyfill';

// import vue
import Vue from 'vue';
import VueRouter from 'vue-router';
import SignIn from '#src/components/signin/signin.vue';
import SignUp from '#src/components/signup/signup.vue';
import TownsExplorer from '#src/components/towns/explorer/explorer.vue';
import Landing from '#src/components/landing/landing.vue';
import { isLoggedIn } from '#src/helpers/userHelper';
import { isLoaded as isConfigLoaded } from '#src/helpers/configHelper';

Vue.use(VueRouter);

/**
 * This a navigation before-enter guard that ensures the current user is logged-in
 *
 * If the user is logged-in, perform the routing as requested.
 * Redirect to the home, otherwise.
 *
 * Please @see https://router.vuejs.org/guide/advanced/navigation-guards.html#per-route-guard
 * for more information about VueJS navigation guards.
 *
 * @param {Route}    to   The target Route Object being navigated to
 * @param {Route}    from The current route being navigated away from
 * @param {Function} next Resolver
 */
function checkUser(to, from, next) {
    if (isLoggedIn() === true && isConfigLoaded() === true) {
        next();
    } else {
        next('/');
    }
}

const router = new VueRouter({
    linkExactActiveClass: 'active',
    routes: [
        {
            path: '/',
            redirect: () => {
                if (isLoggedIn() !== true) {
                    return '/connexion';
                }

                if (isConfigLoaded() !== true) {
                    return '/landing';
                }

                return '/liste-des-sites;';
            },
        },
        { path: '/connexion', component: SignIn },
        { path: '/demande-d-acces', component: SignUp },
        { path: '/landing', component: Landing },
        { path: '/liste-des-sites', component: TownsExplorer, beforeEnter: checkUser },
    ],
});

Vue.createElement = obj => new Vue(obj);
Vue.createElement({
    el: '#app',
    router,
});
