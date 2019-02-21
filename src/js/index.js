// load the whole betagouv template
import 'template.data.gouv.fr/dist/style/main.css';
import 'simplebar/dist/simplebar.min.css';
import '../css/index.scss';

// import polyfills
import '@babel/polyfill';

// import vue
import Vue from 'vue';
import Notifications from 'vue-notification';
import VueRouter from 'vue-router';
import { router } from '#app/router';

window.App = Object.freeze({
    formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return `${(`0${date.getDate()}`).slice(-2)}/${(`0${date.getMonth() + 1}`).slice(-2)}/${date.getFullYear()}`;
    },
});

Vue.use(VueRouter);
Vue.use(Notifications);

Vue.createElement = obj => new Vue(obj);
Vue.createElement({
    el: '#app',
    router,
});
