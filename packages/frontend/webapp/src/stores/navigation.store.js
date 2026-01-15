import { defineStore } from "pinia";
import router from "@/helpers/router";
import { useConfigStore } from "@/stores/config.store.js";
import { useUserStore } from "@/stores/user.store.js";
import getBlogUrl from "@/utils/environment";

function createBlogRoute(baseUrl, path, params = {}) {
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    let fullUrl = `${cleanBaseUrl}${cleanPath}`;

    if (Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            searchParams.append(key, value);
        });
        fullUrl += `?${searchParams.toString()}`;
    }
    return fullUrl;
}

const blogRessourceRoute = createBlogRoute(
    getBlogUrl(),
    "/blog-résorption-bidonvilles/",
    {
        category: "ressources",
    }
);

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
        icon: "fa-regular fa-user-plus",
        label: "Inviter des utilisateurs",
        route: "/invitation?from=navbar",
        authRequirement: "signedIn",
    },
    {
        icon: "fa-newspaper fa-regular",
        label: "Blog",
        route: getBlogUrl(),
        authRequirement: "none",
    },
    {
        icon: "fa-book fa-regular",
        label: "Ressources",
        route: `${blogRessourceRoute}`,
        authRequirement: "none",
    },
    {
        icon: "fa-user fa-regular",
        label: "Mon profil",
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

    return !(configRequired === true && !isLoaded);
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
        metricsItem: () => {
            const userStore = useUserStore();
            const metricsItem = {
                label: "Visualisation des données",
                route: "/visualisation-donnees",
            };

            if (
                userStore.user.intervention_areas.is_national ||
                userStore.hasMoreThanOneDepartementForMetrics
            ) {
                return metricsItem;
            }

            let departementArea;
            const mainArea = userStore.firstMainArea;
            if (mainArea?.departement) {
                departementArea = mainArea;
            } else {
                const allowedDepartements = userStore.departementsForMetrics;
                if (allowedDepartements.length === 1) {
                    departementArea = {
                        departement: {
                            code: allowedDepartements[0].code,
                            name: allowedDepartements[0].name,
                        },
                    };
                }
            }

            if (departementArea) {
                metricsItem.route = `/visualisation-donnees/departement/${departementArea.departement.code}`;
            }

            return metricsItem;
        },
        mainItems() {
            const configStore = useConfigStore();
            if (!configStore.isLoaded) {
                return [];
            }

            const items = [
                { label: "Accueil", route: "/" },
                { label: "Sites", route: "/liste-des-sites" },
                { label: "Actions", route: "/liste-des-actions" },
                { ...this.metricsItem, active: false },
                { label: "Entraide", route: "/communaute" },
                { label: "Carte", route: "/cartographie" },
                { label: "Dernières activités", route: "/activites" },
                { label: "Administration", route: "/acces" },
            ];

            const userStore = useUserStore();
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
