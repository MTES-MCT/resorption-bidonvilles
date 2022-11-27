import { createRouter, createWebHistory } from "vue-router";
import TableauDeBordView from "@/views/TableauDeBordView.vue";

import { useUserStore } from "@/stores/user.store.js";
import { useConfigStore } from "@/stores/config.store.js";
import { useNavigationStore } from "@/stores/navigation.store";
import { createNavigationLog } from "@/api/me.api";
import logout from "@/utils/logout";
import waitForElement from "@/utils/waitForElement";

// au chargement d'une page, on scroll automatiquement vers l'élément indiqué par le hash
// dans certains cas cela pose problème : par exemple dans le cas de la fiche site, quand on scrolle
// manuellement pour passer de sections en sections le hash est changé manuellement. Cela revient,
// pour le routeur, à un changement de page et le scroll automatique s'active, ce qui n'est pas
// souhaitable dans ce cas.
// cette variable est utilisée en combinaison avec la fonction setHashWithoutScroll() plus bas
// pour pouvoir changer le hash de la page sans activer le scroll automatique
let ignoreNextScroll = false;

// les meta existantes sont
// - navTab : indique à quel onglet de navigation la page appartient (sert à indiquer l'onglet actif)
// - authRequirement : 'signedIn' (connecté), 'signedOut' (déconnecté), 'none' (peu importe) (default: 'signedIn')
// - configRequired : est-ce que la config doit être chargée pour accéder à cette page (default: true)
// - analyticsIgnore : est-ce que la page doit être trackée sur matomo ou non
// - permissions : une liste de permissions (au format "entity.list") nécessaires pour accéder à la page
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
            return savedPosition;
        }

        if (to.hash) {
            if (ignoreNextScroll === true) {
                ignoreNextScroll = false;
                return;
            }

            waitForElement(to.hash, (el) => {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: "smooth" });
                }, 100);
            });

            return {
                selector: to.hash,
            };
        }

        return {
            top: 0,
        };
    },

    routes: [
        {
            path: "/",
            redirect: () => {
                const navigationStore = useNavigationStore();
                const { entrypoint } = navigationStore;
                if (entrypoint) {
                    navigationStore.entrypoint = null;
                    return entrypoint;
                }

                return "/tableau-de-bord";
            },
            meta: {
                analyticsIgnore: true,
                navTab: "tableau-de-bord",
            },
        },
        {
            path: "/acces",
            component: () => import("@/views/ListeAccesView.vue"),
            meta: {
                authRequirement: "signedIn",
                navTab: "administration",
                permissions: ["user.list"],
            },
        },
        {
            path: "/acces/:id",
            component: () => import("@/views/AccesView.vue"),
            meta: {
                authRequirement: "signedIn",
                navTab: "administration",
                permissions: ["user.activate"],
            },
        },
        {
            path: "/activites",
            component: () => import("@/views/HistoriqueActivitesView.vue"),
            meta: {
                authRequirement: "signedIn",
                navTab: "activites",
                permissions: ["shantytown.list"],
            },
        },
        {
            path: "/annuaire/:id?",
            redirect(to) {
                if (to.params.id) {
                    return `/structure/${to.params.id}`;
                }

                return "/communaute";
            },
        },
        {
            path: "/cartographie",
            component: () => import("@/views/CartographieView.vue"),
            meta: {
                authRequirement: "signedIn",
                navTab: "cartographie",
            },
        },
        {
            path: "/chargement",
            component: () => import("@/views/ChargementView.vue"),
            meta: {
                analyticsIgnore: true,
                authRequirement: "signedIn",
                configRequired: false,
                charteRequirement: false,
            },
        },
        {
            path: "/communaute",
            component: () => import("@/views/AnnuaireView.vue"),
            meta: {
                authRequirement: "signedIn",
                navTab: "communaute",
            },
        },
        {
            path: "/connexion",
            component: () => import("@/views/ConnexionView.vue"),
            meta: {
                authRequirement: "signedOut",
            },
        },
        {
            path: "/contact",
            component: () => import("@/views/DemandeAccesView.vue"),
            meta: {
                authRequirement: "signedOut",
            },
        },
        {
            path: "/deconnexion",
            beforeEnter: (to, from, next) => {
                logout();
                return next("/connexion");
            },
            component: () => null,
            meta: {
                authRequirement: "signedIn",
                charteRequirement: false,
            },
        },
        {
            path: "/invitation",
            component: () => import("@/views/InvitationView.vue"),
            meta: {
                authRequirement: "none",
            },
        },
        {
            path: "/liste-des-sites",
            component: () => import("@/views/ListeDesSitesView.vue"),
            meta: {
                authRequirement: "signedIn",
                navTab: "sites",
            },
        },
        {
            path: "/liste-des-actions",
            component: () => import("@/views/ListeDesActionsView.vue"),
            meta: {
                authRequirement: "signedIn",
                navTab: "actions",
            },
        },
        {
            path: "/mon-compte",
            redirect: "/mon-compte/informations-personnelles",
        },
        {
            path: "/mon-compte/:tab(informations-personnelles|identifiants|abonnements)",
            component: () => import("@/views/MonCompteView.vue"),
            meta: {
                authRequirement: "signedIn",
            },
        },
        {
            path: "/nouvel-utilisateur",
            component: () => import("@/views/CreerUtilisateurView.vue"),
            meta: {
                authRequirement: "signedIn",
                navTab: "administration",
                permissions: ["user.create"],
            },
        },
        {
            path: "/nouvel-utilisateur/:id",
            redirect(to) {
                return `/acces/${to.params.id}`;
            },
        },
        {
            path: "/nouvelle-version",
            component: () => import("@/views/NouveautesView.vue"),
            meta: {
                authRequirement: "signedIn",
            },
        },
        {
            path: "/signature-charte-engagement",
            component: () => import("@/views/CharteEngagementView.vue"),
            meta: {
                authRequirement: "signedIn",
                charteRequirement: false,
            },
        },
        {
            path: "/nouveau-mot-de-passe",
            component: () => import("@/views/MotDePasseOublieView.vue"),
            meta: {
                authRequirement: "signedOut",
            },
        },
        {
            path: "/page-interdite",
            component: () => import("@/views/PageInterditeView.vue"),
            meta: {
                authRequirement: "none",
            },
        },
        {
            path: "/renouveler-mot-de-passe/:token",
            component: () => import("@/views/ChangementMotDePasseView.vue"),
            meta: {
                authRequirement: "signedOut",
            },
        },
        {
            path: "/activer-mon-compte/:token",
            component: () => import("@/views/ActivationCompteView.vue"),
            meta: {
                authRequirement: "signedOut",
            },
        },
        {
            path: "/session-expiree",
            component: () => import("@/views/SessionExpiree.vue"),
            meta: {
                authRequirement: "signedOut",
            },
        },
        {
            path: "/site/:id",
            component: () => import("@/views/FicheSiteView.vue"),
            meta: {
                authRequirement: "signedIn",
                navTab: "sites",
            },
        },
        {
            path: "/site/:id/fermeture",
            component: () => import("@/views/FermetureDeSiteView.vue"),
            meta: {
                authRequirement: "signedIn",
                navTab: "sites",
            },
        },
        {
            path: "/statistiques/:code?",
            component: () => import("@/views/StatistiquesView.vue"),
            meta: {
                authRequirement: "signedIn",
                navTab: "statistiques",
                permissions: ["stats.read"],
            },
        },
        {
            path: "/structure/:id",
            component: () => import("@/views/FicheStructureView.vue"),
            meta: {
                authRequirement: "signedIn",
                navTab: "communaute",
            },
        },
        {
            path: "/tableau-de-bord",
            component: TableauDeBordView,
            meta: {
                navTab: "tableau-de-bord",
                authRequirement: "signedIn",
            },
        },
        {
            path: "/utilisateur/:id",
            redirect(to) {
                return `/utilisateur/${to.params.id}/informations-personnelles`;
            },
        },
        {
            path: "/utilisateur/:id/:tab(informations-personnelles|identifiants|abonnements)",
            component: () => import("@/views/ProfilUtilisateurView.vue"),
            meta: {
                authRequirement: "signedIn",
                navTab: "administration",
            },
        },

        // special
        {
            path: "/:catchAll(.*)",
            redirect: "/404",
        },
        {
            path: "/404",
            component: () => import("@/views/NotFoundView.vue"),
            meta: {
                authRequirement: "none",
            },
        },
    ],
});

router.setHashWithoutScroll = (hash) => {
    ignoreNextScroll = true;
    router.replace({
        hash,
    });
};

router.beforeEach((to) => {
    const userStore = useUserStore();

    // compute default requirements
    let { authRequirement, configRequired, charteRequirement } = to.meta;
    if (authRequirement === undefined) {
        authRequirement = "signedIn";
    }

    if (charteRequirement === undefined) {
        charteRequirement = authRequirement === "signedIn";
    }

    if (configRequired === undefined) {
        configRequired = authRequirement === "signedIn";
    }

    // signedOut requirement
    if (authRequirement === "signedOut" && userStore.isLoggedIn) {
        return "/";
    }

    // signedIn requirement
    if (authRequirement === "signedIn" && !userStore.isLoggedIn) {
        const navigationStore = useNavigationStore();
        navigationStore.entrypoint = to.fullPath;
        return `/connexion`;
    }

    // config requirement
    const configStore = useConfigStore();
    if (configRequired === true && !configStore.isLoaded) {
        const navigationStore = useNavigationStore();
        navigationStore.entrypoint = to.fullPath;
        return "/chargement";
    }

    // charte requirement
    if (charteRequirement === true && !userStore.hasAcceptedCharte) {
        return "/signature-charte-engagement";
    }

    // changelog requirement
    if (
        configStore.config?.changelog?.length > 0 &&
        to.path !== "/nouvelle-version"
    ) {
        const navigationStore = useNavigationStore();
        navigationStore.entrypoint = to.fullPath;
        return "/nouvelle-version";
    }

    // permissions requirement
    if (to.meta.permissions?.length > 0) {
        if (
            !to.meta.permissions.every((permissionName) =>
                userStore.hasPermission(permissionName)
            )
        ) {
            return "/page-interdite";
        }
    }

    // if logged, register navigation log
    if (userStore.isLoggedIn) {
        createNavigationLog(to.path);
    }
});

export default router;
