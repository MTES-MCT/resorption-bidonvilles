/** @type { import('@storybook/react').Preview } */
import {
    createRouter,
    createWebHashHistory
} from "vue-router";
import { createI18n } from "vue-i18n";

// import { app } from '@storybook/vue3';
import { setup } from '@storybook/vue3'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faHouseCircleCheck, faSpinner, faTimes, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import '../src/css/styles.css';

library.add(faGithub);
library.add(faHome);
library.add(faHouseCircleCheck);
library.add(faSpinner);
library.add(faTimes);
library.add(faArrowUpRightFromSquare);

const i18n = createI18n({
    locale: 'fr',
    messages: {
        fr: {
            footer: {
                "newsletterTitle": "Gardons le contact",
                "newsletterBody": "Recevez l'actualité sur le sujet des bidonvilles tous les mois.",
                "newsletterCta": "Je m'abonne",
            
                "contactTitle": "Un problème, une question?",
                "contactBody1": "Appelez nous au +33 1 40 81 95 39",
                "contactBody2": "Écrivez-nous à",
            
                "socialTitle1": "Suivez-nous",
                "socialTitle2": "sur les réseaux sociaux",
            
                "sourceCode": "Code source",
                "statistics": "Mesures d'impact",
                "legal": "Mentions légales",
                "cgus": "CGU",
                "RGAA": "Accessibilité : non conforme"
            }
        }
    },
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


setup((app) => {
    app.component('font-awesome-icon', FontAwesomeIcon);
    app.component('ValidationProvider', {
        template: '<div><slot :errors="{}" /></div>'
    });

    app.use(i18n);
    app.use(router)
});

export default preview;
