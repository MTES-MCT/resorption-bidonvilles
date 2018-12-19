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
import { checkLogin, isLoggedIn } from '#src/helpers/userHelper';

Vue.use(VueRouter);

const router = new VueRouter({
    linkExactActiveClass: 'active',
    routes: [
        {
            path: '/',
            redirect: () => {
                if (isLoggedIn() === true) {
                    return '/liste-des-sites';
                }

                return '/connexion';
            },
        },
        { path: '/connexion', component: SignIn },
        { path: '/demande-d-acces', component: SignUp },
        { path: '/liste-des-sites', component: TownsExplorer, beforeEnter: checkLogin },
    ],
});

Vue.createElement = obj => new Vue(obj);
Vue.createElement({
    el: '#app',
    router,
});
