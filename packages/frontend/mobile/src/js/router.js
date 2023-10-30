import { createRouter, createWebHistory } from "vue-router";
import FinDeService from "#src/js/pages/FinDeService.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: "/",
            component: FinDeService,
            meta: {
                analyticsIgnore: true,
            },
        },
        {
            path: "/:catchAll(.*)",
            redirect: "/",
        },
    ],
});

export default router;
