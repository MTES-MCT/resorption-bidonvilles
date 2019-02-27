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
import VueMatomo from 'vue-matomo';
import { router } from '#app/router';

window.App = Object.freeze({
    formatDate(timestamp, format = 'd/m/y') {
        const date = new Date(timestamp * 1000);
        return format
            .replace('d', (`0${date.getDate()}`).slice(-2))
            .replace('m', (`0${date.getMonth() + 1}`).slice(-2))
            .replace('y', date.getFullYear());
    },
});

Vue.use(VueRouter);
Vue.use(Notifications);
Vue.use(VueMatomo, {
    // Configure your matomo server and site by providing
    host: 'https://stats.data.gouv.fr',
    siteId: 86,

    // Changes the default .js and .php endpoint's filename
    // Default: 'piwik'
    trackerFileName: 'piwik',

    // Enables automatically registering pageviews on the router
    router,

    // Enables link tracking on regular links. Note that this won't
    // work for routing links (ie. internal Vue router links)
    // Default: true
    enableLinkTracking: true,

    // Require consent before sending tracking information to matomo
    // Default: false
    requireConsent: false,

    // Whether to track the initial page view
    // Default: true
    trackInitialView: true,

    // Whether or not to log debug information
    // Default: false
    debug: true,
});

Vue.createElement = obj => new Vue(obj);
Vue.createElement({
    el: '#app',
    router,
});
