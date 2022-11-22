
import {
    createRouter,
    createWebHashHistory
} from "vue-router";
import { app } from '@storybook/vue3';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHouseCircleCheck, faSpinner, faTimes, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import '../src/css/styles.css';

library.add(faHouseCircleCheck);
library.add(faSpinner);
library.add(faTimes);
library.add(faArrowUpRightFromSquare);

app.component('font-awesome-icon', FontAwesomeIcon);
app.component('ValidationProvider', {
    template: '<div><slot :errors="{}" /></div>'
});

const router = createRouter({
    history: createWebHashHistory(),
    routes: [],
});

app.use(router);

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};
