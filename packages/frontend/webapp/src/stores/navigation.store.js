import { defineStore } from "pinia";
import router from "@/helpers/router";
import { useConfigStore } from "@/stores/config.store.js";
import { useUserStore } from "@/stores/user.store.js";

const topItems = [
    {
        icon: "arrow-right-to-bracket",
        label: "Me connecter",
        route: "/connexion",
        authRequirement: "signedOut",
    },
    {
        icon: "fa-user fa-regular",
        label: "Demander un accès",
        route: "/contact",
        authRequirement: "signedOut",
    },
    {
        icon: "fa-newspaper fa-regular",
        label: "Blog",
        route: "https://www.blog-resorption-bidonvilles.fr",
        authRequirement: "none",
    },
    {
        icon: "fa-book fa-regular",
        label: "Ressources",
        route: "https://www.blog-resorption-bidonvilles.fr/accueil/categories/ressources",
        authRequirement: "none",
    },
    {
        icon: "fa-user fa-regular",
        label: "Mon compte",
        route: "/mon-compte",
        authRequirement: "signedIn",
        configRequired: true,
    },
    {
        icon: "arrow-right-to-bracket",
        label: "Me déconnecter",
        route: "/deconnexion",
        authRequirement: "signedIn",
    },
];

function filterByAuthRequirement(item, { isLoggedIn, isLoaded }) {
    const { authRequirement, configRequired } = item;
    if (authRequirement === "none") {
        return true;
    }

    if (authRequirement === "signedOut" && isLoggedIn) {
        return false;
    }

    if ((!authRequirement || authRequirement === "signedIn") && !isLoggedIn) {
        return false;
    }

    if (configRequired === true && !isLoaded) {
        return false;
    }

    return true;
}

export const useNavigationStore = defineStore("navigation", {
    state: () => ({
        entrypoint: null,
    }),
    getters: {
        topItems: () => {
            const configStore = useConfigStore();
            const userStore = useUserStore();

            return topItems.filter((item) => {
                return filterByAuthRequirement(item, {
                    isLoggedIn: userStore.isLoggedIn,
                    isLoaded: configStore.isLoaded,
                });
            });
        },
        mainItems: () => {
            const configStore = useConfigStore();
            if (!configStore.isLoaded) {
                return [];
            }

            const metricsItem = {
                label: "Visualisation des données",
                route: "/visualisation-donnees",
            };
            const items = [
                { label: "Accueil", route: "/" },
                { label: "Sites", route: "/liste-des-sites" },
                { label: "Actions", route: "/liste-des-actions" },
                metricsItem,
                { label: "Entraide", route: "/communaute" },
                { label: "Carte", route: "/cartographie" },
                { label: "Dernières activités", route: "/activites" },
                { label: "Administration", route: "/acces" },
            ];

            const userStore = useUserStore();
            const { departement } = userStore.user.organization.location;
            if (departement !== null) {
                metricsItem.route = `/visualisation-donnees/departement/${departement.code}`;
            }

            const itemsFilteredByPermission = items.filter((item) => {
                const { permissions } = router.resolve(item.route).meta;
                if (!permissions) {
                    return true;
                }

                return permissions.every((permission) =>
                    userStore.hasPermission(permission)
                );
            });

            const { navTab: currentNavTab } = router.currentRoute.value.meta;
            if (!currentNavTab) {
                return itemsFilteredByPermission;
            }

            return itemsFilteredByPermission.map((item) => {
                item.active =
                    router.resolve(item.route).meta.navTab === currentNavTab;
                return item;
            });
        },
    },
});
