import { createRouter, createWebHistory } from "vue-router";
import TableauDeBordView from "@/views/TableauDeBordView.vue";

import { useUserStore } from "@/stores/user.store.js";
import { useConfigStore } from "@/stores/config.store.js";
import { useNavigationStore } from "@/stores/navigation.store";
import { createNavigationLog } from "@/api/me.api";
import logout from "@/utils/logout";
import waitForElement from "@/utils/waitForElement";
const defaultTitle = "Résorption Bidonvilles"; // Titre par défaut
let currentRouteIsBacked = false;
window.popStateDetected = false;
window.addEventListener("popstate", () => {
    currentRouteIsBacked = true;
    window.popStateDetected = true;
});

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
            path: "/visualisation-donnees",
            component: () =>
                import("@/views/DonneesStatistiquesRegionsView.vue"),
            meta: {
                title: "Visualiser les données",
                authRequirement: "signedIn",
                navTab: "metrics",
            },
        },
        {
            path: "/visualisation-donnees/departement/:code",
            component: () =>
                import("@/views/DonneesStatistiquesDepartementView.vue"),
            meta: {
                title: "Visualiser les données départementales",
                authRequirement: "signedIn",
                navTab: "metrics",
            },
        },
        {
            path: "/acces",
            component: () => import("@/views/ListeAccesView.vue"),
            meta: {
                title: "Consulter la liste des comptes",
                authRequirement: "signedIn",
                navTab: "administration",
                permissions: ["user.list"],
            },
        },
        {
            path: "/acces/:id",
            component: () => import("@/views/AccesView.vue"),
            meta: {
                title: "Gérer les accès d'un utilisateur",
                authRequirement: "signedIn",
                navTab: "administration",
                permissions: ["user.activate"],
            },
        },
        {
            path: "/action/:id",
            component: () => import("@/views/FicheActionView.vue"),
            meta: {
                title: "Consulter une fiche action",
                authRequirement: "signedIn",
                navTab: "actions",
            },
        },
        {
            path: "/action/:id/mise-a-jour",
            component: () => import("@/views/MiseAJourActionView.vue"),
            meta: {
                title: "Mettre à jour une fiche action",
                authRequirement: "signedIn",
                navTab: "actions",
            },
        },
        {
            path: "/action/nouveau",
            component: () => import("@/views/DeclarationActionView.vue"),
            meta: {
                title: "Créer une fiche action",
                authRequirement: "signedIn",
                navTab: "actions",
                permissions: ["action.create"],
            },
        },
        {
            path: "/activites",
            component: () => import("@/views/HistoriqueActivitesView.vue"),
            meta: {
                title: "Visualiser l'historique des activités",
                authRequirement: "signedIn",
                navTab: "activites",
                permissions: ["shantytown.list"],
            },
        },
        {
            path: "/annuaire/:id",
            redirect(to) {
                return `/structure/${to.params.id}`;
            },
        },
        {
            path: "/cartographie",
            component: () => import("@/views/CartographieView.vue"),
            meta: {
                title: "Visualiser la carte des bidonvilles",
                authRequirement: "signedIn",
                navTab: "cartographie",
            },
        },
        {
            path: "/chargement",
            component: () => import("@/views/ChargementView.vue"),
            meta: {
                title: "Chargement de la plateforme en cours",
                analyticsIgnore: true,
                authRequirement: "signedIn",
                configRequired: false,
                charteRequirement: false,
            },
        },
        {
            path: "/annuaire",
            component: () => import("@/views/AnnuaireView.vue"),
            meta: {
                title: "Consulter l'annuaire",
                authRequirement: "signedIn",
                navTab: "communaute",
                communauteTab: "annuaire",
            },
        },

        {
            path: "/communaute",
            component: () => import("@/views/CommunauteView.vue"),
            meta: {
                title: "Demander de l'aide à la communauté",
                authRequirement: "signedIn",
                navTab: "communaute",
                communauteTab: "communaute",
            },
        },
        {
            path: "/communaute/nouvelle-question",
            component: () =>
                import("@/views/NouvelleQuestionCommunauteView.vue"),
            meta: {
                title: "Poser une question à la communauté",
                authRequirement: "signedIn",
                navTab: "communaute",
            },
        },
        {
            path: "/question/:id",
            component: () => import("@/views/FicheQuestionView.vue"),
            meta: {
                title: "Consulter, répondre à une question posée à la communauté",
                authRequirement: "signedIn",
                navTab: "communaute",
                communauteTab: "communaute",
            },
        },
        {
            path: "/connexion",
            component: () => import("@/views/ConnexionView.vue"),
            meta: {
                title: "S'identifier sur la plateforme",
                authRequirement: "signedOut",
            },
        },
        {
            path: "/contact",
            component: () => import("@/views/DemandeAccesView.vue"),
            meta: {
                title: "Contacter l'équipe",
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
                title: "Inviter vos contacts sur la plateforme",
                authRequirement: "none",
            },
        },
        {
            path: "/liste-des-sites",
            component: () => import("@/views/ListeDesSitesView.vue"),
            meta: {
                title: "Afficher la liste des sites",
                authRequirement: "signedIn",
                navTab: "sites",
            },
        },
        {
            path: "/liste-des-actions",
            component: () => import("@/views/ListeDesActionsView.vue"),
            meta: {
                title: "Afficher la liste des actions",
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
                title: "Modifier les informations liées à mon compte",
                authRequirement: "signedIn",
            },
        },
        {
            path: "/nouvel-utilisateur",
            component: () => import("@/views/CreerUtilisateurView.vue"),
            meta: {
                title: "Ajouter un nouvel utilisateur",
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
                title: "Voir les nouveautés disponibles sur la plateforme",
                authRequirement: "signedIn",
            },
        },
        {
            path: "/signature-charte-engagement",
            component: () => import("@/views/CharteEngagementView.vue"),
            meta: {
                title: "Accepter la charte d'engagement",
                authRequirement: "signedIn",
                charteRequirement: false,
            },
        },
        {
            path: "/nouveau-mot-de-passe",
            component: () => import("@/views/MotDePasseOublieView.vue"),
            meta: {
                title: "Demander un nouveau mot de passe",
                authRequirement: "signedOut",
            },
        },
        {
            path: "/page-interdite",
            component: () => import("@/views/PageInterditeView.vue"),
            meta: {
                title: "Accès refusé à la page demandée",
                authRequirement: "none",
            },
        },
        {
            path: "/renouveler-mot-de-passe/:token",
            component: () => import("@/views/ChangementMotDePasseView.vue"),
            meta: {
                title: "Renouveler mon mot de passe",
                authRequirement: "signedOut",
            },
        },
        {
            path: "/activer-mon-compte/:token",
            component: () => import("@/views/ActivationCompteView.vue"),
            meta: {
                title: "Activer mon compte",
                authRequirement: "signedOut",
            },
        },
        {
            path: "/site/:id",
            component: () => import("@/views/FicheSiteView.vue"),
            meta: {
                title: "Visualiser les données d'un site",
                authRequirement: "signedIn",
                navTab: "sites",
            },
        },
        {
            path: "/site/:id/fermeture",
            component: () => import("@/views/FermetureDeSiteView.vue"),
            meta: {
                title: "Déclarer la fermeture d'un site",
                authRequirement: "signedIn",
                navTab: "sites",
            },
        },
        {
            path: "/site/:id/mise-a-jour",
            component: () => import("@/views/MiseAJourDeSiteView.vue"),
            meta: {
                title: "Mettre à jour les données d'un site",
                authRequirement: "signedIn",
                navTab: "sites",
            },
        },
        {
            path: "/site/nouveau",
            component: () => import("@/views/DeclarationDeSiteView.vue"),
            meta: {
                title: "Déclarer un site",
                authRequirement: "signedIn",
                navTab: "sites",
                permissions: ["shantytown.create"],
            },
        },
        {
            path: "/site/signalement",
            component: () => import("@/views/SignalementDeSiteView.vue"),
            meta: {
                title: "Signaler un site",
                authRequirement: "signedIn",
                navTab: "sites",
            },
        },
        {
            path: "/statistiques/:code?",
            component: () => import("@/views/StatistiquesView.vue"),
            meta: {
                title: "Consulter les statistiques dans un département",
                authRequirement: "signedIn",
                navTab: "statistiques",
                permissions: ["stats.read"],
            },
        },
        {
            path: "/structure/:id",
            component: () => import("@/views/FicheStructureView.vue"),
            meta: {
                title: "Consulter la fiche d'une structure",
                authRequirement: "signedIn",
                navTab: "communaute",
                communauteTab: "annuaire",
            },
        },
        {
            path: "/tableau-de-bord",
            component: TableauDeBordView,
            meta: {
                title: "Consulter le tableau de bord",
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
                title: "Consulter, modifier un compte utilisateur",
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
                title: "Page inexistante",
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

router.beforeEach((to, from) => {
    currentRouteIsBacked = window.popStateDetected === true;
    window.popStateDetected = false;

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
    if (userStore.isLoggedIn && router.currentRoute.value?.path !== to.path) {
        createNavigationLog(to.path);
    }

    // Update html title element
    // avoid re-setting the title if only the hash changed (sometimes the view customizes the title, we don't want
    // to override that by re-setting the title when scrolling through the page)
    if (from.path !== to.path) {
        setDocumentTitle(to.meta.title);
    }
});

export function setDocumentTitle(title) {
    document.title = title ? `${title} — ${defaultTitle}` : defaultTitle;
}

export default router;
export function isCurrentRouteBack() {
    return currentRouteIsBacked;
}
