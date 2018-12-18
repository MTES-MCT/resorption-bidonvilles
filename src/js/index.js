// load the whole betagouv template
import 'template.data.gouv.fr/dist/style/main.css';
import '../css/index.scss';

// import polyfills
import '@babel/polyfill';

// import vue
import Vue from 'vue';
import VueRouter from 'vue-router';
import SignIn from './components/signin/index.vue';
import SignUp from './components/signup/index.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    linkExactActiveClass: 'active',
    routes: [
        {
            path: '/',
            redirect: () => {
                if (window.signedin === true) {
                    return '/liste-des-sites';
                }

                return '/connexion';
            },
        },
        { path: '/connexion', component: SignIn },
        { path: '/demande-d-acces', component: SignUp },
    ],
});

Vue.createElement = obj => new Vue(obj);
Vue.createElement({
    el: '#app',
    router,
});
