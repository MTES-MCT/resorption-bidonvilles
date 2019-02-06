// load the whole betagouv template
import 'template.data.gouv.fr/dist/style/main.css';
import 'simplebar/dist/simplebar.min.css';
import '../css/index.scss';

// import polyfills
import '@babel/polyfill';

// import vue
import Vue from 'vue';
import VueRouter from 'vue-router';
import { router } from '#app/router';

Vue.use(VueRouter);

Vue.createElement = obj => new Vue(obj);
Vue.createElement({
    el: '#app',
    router,
});
