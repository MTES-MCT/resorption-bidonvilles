/** @type { import('@storybook/react').Preview } */
import {
    createRouter,
    createWebHashHistory
} from "vue-router";
// import { app } from '@storybook/vue3';
import { setup } from '@storybook/vue3'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faHouseCircleCheck, faSpinner, faTimes, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import '../src/css/styles.css';

library.add(faHome);
library.add(faHouseCircleCheck);
library.add(faSpinner);
library.add(faTimes);
library.add(faArrowUpRightFromSquare);

setup((app) => {
    app.component('font-awesome-icon', FontAwesomeIcon);
    app.component('ValidationProvider', {
        template: '<div><slot :errors="{}" /></div>'
    });
    app.use(router)
});

const router = createRouter({
    history: createWebHashHistory(),
    routes: [],
});

const preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
    },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};
export default preview;