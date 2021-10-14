const path = require("path");

module.exports = [
    {
        path: "/",
        component: path.join(
            __dirname,
            "./src/js/app/pages/LandingPage/index.vue"
        ),
        context: {
            beforeEnter: "home",
            ssr: true
        }
    },
    {
        path: "/contact",
        component: path.join(__dirname, "./src/js/app/pages/Contact/index.vue"),
        context: {
            beforeEnter: "anonymous",
            ssr: true
        }
    },
    {
        path: "/stats",
        component: path.join(
            __dirname,
            "./src/js/app/pages/PublicStats/index.vue"
        ),
        context: {
            beforeEnter: "anonymous",
            ssr: true
        }
    },
    {
        path: "/connexion",
        component: path.join(__dirname, "./src/js/app/pages/SignIn/index.vue"),
        context: {
            beforeEnter: "anonymous",
            ssr: true
        }
    },
    {
        path: "/invitation",
        component: path.join(
            __dirname,
            "./src/js/app/pages/Invitation/index.vue"
        ),
        context: {
            ssr: true
        }
    },
    {
        path: "/mentions-legales",
        component: path.join(
            __dirname,
            "./src/js/app/pages/legalMentions/legalMentions.vue"
        ),
        context: {
            ssr: true
        }
    },
    {
        path: "/nouveau-mot-de-passe",
        component: path.join(
            __dirname,
            "./src/js/app/pages/UserRequestNewPassword/index.vue"
        ),
        context: {
            meta: {
                group: "users"
            },
            beforeEnter: "anonymous",
            ssr: true
        }
    }
];
