/** @type { import('@storybook/react').Preview } */
import {
    createRouter,
    createWebHashHistory
} from "vue-router";
import { createI18n } from "vue-i18n";

import { setup } from '@storybook/vue3'

import '../src/css/styles.css';
import '../../common/fontawesome/css/fontawesome.css';
import '../../common/fontawesome/css/brands.css';
import '../../common/fontawesome/css/solid.css';

const i18n = createI18n({
    locale: 'fr',
    messages: {
        fr: {
            footer: {
                "newsletterTitle": "Gardons le contact",
                "newsletterBody": "Recevez l'actualité sur le sujet des bidonvilles tous les mois.",
                "newsletterCta": "Je m'abonne",

                "contactTitle": "Un problème, une question?",
                "contactBody1": "Appelez nous au +33 1 40 81 98 80",
                "contactBody2": "Écrivez-nous à",

                "socialTitle1": "Suivez-nous",
                "socialTitle2": "sur les réseaux sociaux",

                "socialOn": "sur",

                "twitter": "Twitter",
                "facebook": "Facebook",
                "linkedin": "Linkedin",

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
    app.component('ValidationProvider', {
        template: '<div><slot :errors="{}" /></div>'
    });

    app.use(i18n);
    app.use(router)
});

export default preview;
