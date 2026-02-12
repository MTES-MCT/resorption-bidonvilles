import { createRouter, createWebHistory } from "vue-router";
import TableauDeBordView from "@/views/TableauDeBordView.vue";

import { useUserStore } from "@/stores/user.store.js";
import { useConfigStore } from "@/stores/config.store.js";
import { useNavigationStore } from "@/stores/navigation.store";
import { useNotificationStore } from "@/stores/notification.store";
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

// - navTab : indique à quel onglet de navigation la page appartient (sert à indiquer l'onglet actif)
// - analyticsIgnore : est-ce que la page doit être trackée sur matomo ou non
// - displayOrderOnSiteMap : ordre d'affichage de la page dans le plan du site (0 ou négatif pour exclure du plan du site)
// - permissions : une liste de permissions (au format "entity.list") nécessaires pour accéder à la page
// - requirements : contraintes d'accès à la page
//   requirements.auth : 'signedIn' (connecté), 'signedOut' (déconnecté), 'none' (peu importe) (default: 'signedIn')
//   requirements.configLoaded : est-ce que la config doit être chargée pour accéder à cette page (default: true)
//   requirements.charterSigned : est-ce que la charte doit être signée pour accéder à cette page (default: true)
//   requirements.topicsChosen: est-ce que l'utilisateur doit avoir choisi ses domaines de compétence pour accéder à cette page (default: true)
//   requirements.changelogSeen: est-ce que l'utilisateur a vu les dernières nouveautés de la plateforme (default: true)

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
                navTab: "metrics",
                displayOrderOnSiteMap: 15,
            },
        },
        {
            path: "/visualisation-donnees/departement/:code",
            component: () =>
                import("@/views/DonneesStatistiquesDepartementView.vue"),
            meta: {
                title: "Visualiser les données départementales",
                navTab: "metrics",
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/acces",
            component: () => import("@/views/ListeAccesView.vue"),
            meta: {
                title: "Consulter la liste des comptes",
                navTab: "administration",
                permissions: ["user.list"],
                displayOrderOnSiteMap: 16,
            },
        },
        {
            path: "/acces/:id",
            component: () => import("@/views/AccesView.vue"),
            meta: {
                title: "Gérer les accès d'un utilisateur",
                navTab: "administration",
                permissions: ["user.activate"],
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/action/:id",
            component: () => import("@/views/FicheActionView.vue"),
            meta: {
                title: "Consulter une fiche action",
                navTab: "actions",
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/action/:id/mise-a-jour",
            component: () => import("@/views/MiseAJourActionView.vue"),
            meta: {
                title: "Mettre à jour une fiche action",
                navTab: "actions",
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/action/nouveau",
            component: () => import("@/views/DeclarationActionView.vue"),
            meta: {
                title: "Créer une fiche action",
                navTab: "actions",
                permissions: ["action.create"],
                displayOrderOnSiteMap: 9,
            },
        },
        {
            path: "/activites",
            component: () => import("@/views/HistoriqueActivitesView.vue"),
            meta: {
                title: "Visualiser l'historique des activités",
                navTab: "activites",
                permissions: ["shantytown.list"],
                displayOrderOnSiteMap: 14,
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
                navTab: "cartographie",
                displayOrderOnSiteMap: 13,
            },
        },
        {
            path: "/annuaire",
            component: () => import("@/views/AnnuaireView.vue"),
            meta: {
                title: "Consulter l'annuaire",
                navTab: "communaute",
                communauteTab: "annuaire",
                displayOrderOnSiteMap: 12,
            },
        },
        {
            path: "/communaute",
            component: () => import("@/views/CommunauteView.vue"),
            meta: {
                title: "Demander de l'aide à la communauté",
                navTab: "communaute",
                communauteTab: "communaute",
                displayOrderOnSiteMap: 10,
            },
        },
        {
            path: "/communaute/modifier-une-question/:id",
            component: () => import("@/views/MiseAJourDeQuestionView.vue"),
            meta: {
                title: "Modifier une question",
                navTab: "communaute",
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/communaute/nouvelle-question",
            component: () =>
                import("@/views/NouvelleQuestionCommunauteView.vue"),
            meta: {
                title: "Poser une question à la communauté",
                navTab: "communaute",
                displayOrderOnSiteMap: 11,
            },
        },
        {
            path: "/question/:id",
            component: () => import("@/views/FicheQuestionView.vue"),
            meta: {
                title: "Consulter, répondre à une question posée à la communauté",
                navTab: "communaute",
                communauteTab: "communaute",
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/liste-des-sites",
            component: () => import("@/views/ListeDesSitesView.vue"),
            meta: {
                title: "Afficher la liste des sites",
                navTab: "sites",
                displayOrderOnSiteMap: 5,
            },
        },
        {
            path: "/liste-des-actions",
            component: () => import("@/views/ListeDesActionsView.vue"),
            meta: {
                title: "Afficher la liste des actions",
                navTab: "actions",
                displayOrderOnSiteMap: 8,
            },
        },
        {
            path: "/mon-compte",
            redirect: "/mon-compte/informations-personnelles",
            meta: {
                title: "Modifier les informations liées à mon compte",
                displayOrderOnSiteMap: 3,
            },
        },
        {
            path: "/mon-compte/:tab(informations-personnelles|identifiants|abonnements|desactiver-compte|domaines-competence|options)",
            component: () => import("@/views/MonCompteView.vue"),
        },
        {
            path: "/nouvel-utilisateur",
            component: () => import("@/views/CreerUtilisateurView.vue"),
            meta: {
                title: "Ajouter un nouvel utilisateur",
                navTab: "administration",
                permissions: ["user.create"],
                displayOrderOnSiteMap: 17,
            },
        },
        {
            path: "/nouvel-utilisateur/:id",
            redirect(to) {
                return `/acces/${to.params.id}`;
            },
        },
        {
            path: "/nouvelle-structure",
            component: () => import("@/views/CreerStructureView.vue"),
            meta: {
                title: "Créer une nouvelle structure",
                navTab: "administration",
                permissions: ["user.create"],
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/permissions",
            component: () => import("@/views/PermissionsParDefautView.vue"),
            meta: {
                title: "Permissions par défaut",
                navTab: "administration",
                permissions: ["user.list"],
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/plan-du-site",
            component: () => import("@/views/PlanDuSiteView.vue"),
            meta: {
                title: "Plan du site",
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/site/:id",
            component: () => import("@/views/FicheSiteView.vue"),
            meta: {
                title: "Visualiser les données d'un site",
                navTab: "sites",
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/site/:id/fermeture",
            component: () => import("@/views/FermetureDeSiteView.vue"),
            meta: {
                title: "Déclarer la fermeture d'un site",
                navTab: "sites",
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/site/:id/mise-a-jour",
            component: () => import("@/views/MiseAJourDeSiteView.vue"),
            meta: {
                title: "Mettre à jour les données d'un site",
                navTab: "sites",
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/site/nouveau",
            component: () => import("@/views/DeclarationDeSiteView.vue"),
            meta: {
                title: "Déclarer un nouveau site",
                navTab: "sites",
                permissions: ["shantytown.create"],
                displayOrderOnSiteMap: 6,
            },
        },
        {
            path: "/site/signalement",
            component: () => import("@/views/SignalementDeSiteView.vue"),
            meta: {
                title: "Informer d'un nouveau site",
                navTab: "sites",
                displayOrderOnSiteMap: 7,
            },
        },
        {
            path: "/structure/:id",
            component: () => import("@/views/FicheStructureView.vue"),
            meta: {
                title: "Consulter la fiche d'une structure",
                navTab: "communaute",
                communauteTab: "annuaire",
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/tableau-de-bord",
            component: TableauDeBordView,
            meta: {
                title: "Consulter le tableau de bord",
                navTab: "tableau-de-bord",
                displayOrderOnSiteMap: 4,
            },
        },
        {
            path: "/utilisateur/:id",
            redirect(to) {
                return `/utilisateur/${to.params.id}/informations-personnelles`;
            },
        },
        {
            path: "/utilisateur/:id/:tab(informations-personnelles|identifiants|abonnements|domaines-competence|options)",
            component: () => import("@/views/ProfilUtilisateurView.vue"),
            meta: {
                title: "Consulter, modifier un compte utilisateur",
                navTab: "administration",
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/utilisateur/:id/territoires",
            component: () => import("@/views/MiseAjourTerritoiresView.vue"),
            meta: {
                title: "Modifier les territoires d'intervention d'un utilisateur",
                navTab: "administration",
                displayOrderOnSiteMap: 0,
            },
            beforeEnter: (to, from, next) => {
                const userStore = useUserStore();
                if (userStore.isLoggedIn && userStore.user?.is_superuser) {
                    next();
                } else {
                    next("/page-interdite");
                }
            },
        },
        {
            path: "/utilisateurs/permissions",
            component: () => import("@/views/ExceptionsDePermissionView.vue"),
            meta: {
                title: "Utilisateurs et structures avec permissions exceptionnelles",
                navTab: "administration",
                permissions: ["user.list"],
                displayOrderOnSiteMap: 0,
            },
        },

        /********************************************************
         * PAGES AVEC CONTRAINTES PARTICULIERES
         * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
         * Ci-dessous sont listées toutes les pages qui ne sont
         * pas soumises aux contraintes d'accès habituelles
         * (être connecté, avoir signé la charte d'engagement,
         * etc.)
         ********************************************************/
        {
            path: "/accessibilite",
            component: () => import("@/views/DeclarationAccessibilite.vue"),
            meta: {
                title: "Déclaration d'accessibilité",
                requirements: {
                    auth: "none",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
            },
        },
        {
            path: "/schema-pluriannuel",
            component: () =>
                import("@/views/SchemaPluriannuelAccessibilite.vue"),
            meta: {
                title: "Schéma pluriannuel",
                requirements: {
                    auth: "none",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
            },
        },
        {
            path: "/activer-mon-compte/:token",
            component: () => import("@/views/ActivationCompteView.vue"),
            meta: {
                title: "Activer mon compte",
                requirements: {
                    auth: "signedOut",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/chargement",
            component: () => import("@/views/ChargementView.vue"),
            meta: {
                title: "Chargement de la plateforme en cours",
                requirements: {
                    auth: "signedIn",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
                analyticsIgnore: true,
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/choix-des-sujets",
            component: () => import("@/views/ChoixDesSujetsExpertise.vue"),
            meta: {
                title: "Choisir ses domaines de compétence et sujets d'intérêt",
                requirements: {
                    auth: "signedIn",
                    configLoaded: true,
                    charterSigned: true,
                    topicsChosen: false,
                    changelogSeen: false,
                },
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/compte-desactive",
            component: () => import("@/views/CompteDesactiveView.vue"),
            meta: {
                title: "Votre compte a été désactivé",
                requirements: {
                    auth: "none",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/connexion",
            component: () => import("@/views/ConnexionView.vue"),
            meta: {
                title: "S'identifier sur la plateforme",
                requirements: {
                    auth: "signedOut",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
                displayOrderOnSiteMap: 1,
            },
        },
        {
            path: "/contact",
            component: () => import("@/views/DemandeAccesView.vue"),
            meta: {
                title: "Contacter l'équipe",
                requirements: {
                    auth: "signedOut",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
                displayOrderOnSiteMap: 0,
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
                requirements: {
                    auth: "signedIn",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
                displayOrderOnSiteMap: 2,
            },
        },
        {
            path: "/invitation",
            component: () => import("@/views/InvitationView.vue"),
            meta: {
                title: "Inviter vos contacts sur la plateforme",
                requirements: {
                    auth: "none",
                },
                displayOrderOnSiteMap: 18,
            },
        },
        {
            path: "/mentions-legales",
            component: () => import("@/views/MentionsLegales.vue"),
            meta: {
                title: "Mentions légales",
                requirements: {
                    auth: "none",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
            },
        },
        {
            path: "/nouveau-mot-de-passe",
            component: () => import("@/views/MotDePasseOublieView.vue"),
            meta: {
                title: "Demander un nouveau mot de passe",
                requirements: {
                    auth: "signedOut",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/nouvelle-version",
            component: () => import("@/views/NouveautesView.vue"),
            meta: {
                title: "Voir les nouveautés disponibles sur la plateforme",
                requirements: {
                    auth: "signedIn",
                    configLoaded: true,
                    charterSigned: true,
                    topicsChosen: true,
                    changelogSeen: false,
                },
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/page-interdite",
            component: () => import("@/views/PageInterditeView.vue"),
            meta: {
                title: "Accès refusé à la page demandée",
                requirements: {
                    auth: "none",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/renouveler-mot-de-passe/:token",
            component: () => import("@/views/ChangementMotDePasseView.vue"),
            meta: {
                title: "Renouveler mon mot de passe",
                requirements: {
                    auth: "signedOut",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/signature-charte-engagement",
            component: () => import("@/views/CharteEngagementView.vue"),
            meta: {
                title: "Accepter la charte d'engagement",
                requirements: {
                    auth: "signedIn",
                    configLoaded: true,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
                displayOrderOnSiteMap: 0,
            },
        },
        {
            path: "/stats",
            component: () => import("@/views/StatistiquesPubliques.vue"),
            meta: {
                title: "Statistiques publiques",
                requirements: {
                    auth: "none",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
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
                requirements: {
                    auth: "none",
                    configLoaded: false,
                    charterSigned: false,
                    topicsChosen: false,
                    changelogSeen: false,
                },
                displayOrderOnSiteMap: 0,
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

router.beforeEach(async (to, from) => {
    currentRouteIsBacked = window.popStateDetected === true;
    window.popStateDetected = false;

    const userStore = useUserStore();
    let { requirements } = to.meta;
    if (requirements === undefined) {
        requirements = {
            auth: "signedIn",
            configLoaded: true,
            charterSigned: true,
            topicsChosen: true,
            changelogSeen: true,
        };
    }

    // cas particulier des pages en auth 'none'
    // si l'utilisateur est connecté, on force les contraintes par défaut d'un utilisateur connecté
    // sauf indication contraire
    if (requirements.auth === "none" && userStore.isLoggedIn) {
        requirements.auth = "signedIn";
        requirements.configLoaded = requirements.configLoaded !== false;
        requirements.charterSigned = requirements.configLoaded !== false;
        requirements.topicsChosen = requirements.configLoaded !== false;
        requirements.changelogSeen = requirements.configLoaded !== false;
    }

    // c'est parti, on applique les contraintes !
    if (requirements.auth === "signedOut" && userStore.isLoggedIn) {
        return "/";
    }

    if (userStore.user?.is_admin) {
        if (!userStore.user.password_conformity) {
            const authorizedPaths = [
                "/mon-compte/identifiants",
                "/deconnexion",
            ];
            if (!authorizedPaths.includes(to.path)) {
                const notificationStore = useNotificationStore();
                notificationStore.error(
                    "Mot de passe expiré",
                    "En raison du renforcement des règles de sécurité, vous devez modifier votre mot de passe."
                );
                return "/mon-compte/identifiants";
            }
        }
    }

    const navigationStore = useNavigationStore();
    if (requirements.auth === "signedIn" && !userStore.isLoggedIn) {
        navigationStore.entrypoint = to.fullPath;
        return "/connexion";
    }

    const configStore = useConfigStore();
    if (requirements.configLoaded === true && !configStore.isLoaded) {
        navigationStore.entrypoint = to.fullPath;
        return "/chargement";
    }

    if (requirements.charterSigned === true && !userStore.hasAcceptedCharte) {
        return "/signature-charte-engagement";
    }

    if (
        requirements.topicsChosen === true &&
        userStore.user.expertise_topics_chosen !== true
    ) {
        navigationStore.entrypoint = to.fullPath;
        return "/choix-des-sujets";
    }

    // changelog requirement
    if (
        requirements.changelogSeen === true &&
        configStore.config?.changelog?.length > 0
    ) {
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
        await userStore.refreshToken(to.path);
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
