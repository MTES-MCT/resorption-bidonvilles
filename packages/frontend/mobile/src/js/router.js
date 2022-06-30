import VueRouter from "vue-router";
import Signin from '#src/js/pages/Signin.vue';

export default new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            component: Signin
        },
    ]
});
