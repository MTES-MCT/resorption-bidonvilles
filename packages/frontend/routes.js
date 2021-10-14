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
    }
];
