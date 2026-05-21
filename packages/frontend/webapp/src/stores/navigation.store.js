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
        icon: "fr-icon-lock-line",
        label: "Me connecter",
        to: "/connexion",
        authRequirement: "signedOut",
    },
    {
        icon: "fr-icon-user-line",
        label: "Demander un accès",
        to: "/contact?language=fr&acces",
        authRequirement: "signedOut",
    },
    {
        icon: "fr-icon-user-add-fill",
        label: "Inviter des utilisateurs",
        to: "/invitation?from=navbar",
        authRequirement: "signedIn",
    },
    {
        icon: "fr-icon-article-line",
        label: "Blog",
        href: getBlogUrl(),
        target: "_blank",
        authRequirement: "none",
    },
    {
        icon: "fr-icon-book-2-line",
        label: "Ressources",
        href: `${blogRessourceRoute}`,
        target: "_blank",
        authRequirement: "none",
    },
    {
        icon: "fr-icon-user-fill",
        label: "Mon profil",
        to: "/mon-compte",
        authRequirement: "signedIn",
        configRequired: true,
    },
    {
        icon: "fr-icon-logout-box-r-line",
        label: "Me déconnecter",
        to: "/deconnexion",
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

function generateUserName(userInfos) {
    if (!userInfos || !userInfos.first_name || !userInfos.last_name) {
        return "Mon profil";
    }
    return `${userInfos.first_name
        .slice(0, 1)
        .toUpperCase()}${userInfos.first_name
        .slice(1)
        .toLowerCase()} ${userInfos.last_name.slice(0, 1)}.`;
}

export const useNavigationStore = defineStore("navigation", {
    state: () => ({
        entrypoint: null,
    }),
    getters: {
        topItems: () => {
            const configStore = useConfigStore();
            const userStore = useUserStore();
            return topItems
                .map((item) => {
                    if (item.to === "/mon-compte") {
                        return {
                            ...item,
                            label: generateUserName(userStore.user),
                        };
                    }
                    return item;
                })
                .filter((item) => {
                    return filterByAuthRequirement(item, {
                        isLoggedIn: userStore.isLoggedIn,
                        isLoaded: configStore.isLoaded,
                    });
                });
        },
        metricsItem: () => {
            const userStore = useUserStore();
            const metricsItem = {
                text: "Visualisation des données",
                to: "/visualisation-donnees",
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
                metricsItem.to = `/visualisation-donnees/departement/${departementArea.departement.code}`;
            }

            return metricsItem;
        },
        mainItems() {
            const configStore = useConfigStore();
            if (!configStore.isLoaded) {
                return [];
            }

            const items = [
                { text: "Accueil", to: "/" },
                { text: "Sites", to: "/liste-des-sites" },
                { text: "Actions", to: "/liste-des-actions" },
                { ...this.metricsItem, active: false },
                { text: "Entraide", to: "/communaute" },
                { text: "Carte", to: "/cartographie" },
                { text: "Dernières activités", to: "/activites" },
                { text: "Administration", to: "/acces" },
            ];

            const userStore = useUserStore();
            const itemsFilteredByPermission = items.filter((item) => {
                const { permissions } = router.resolve(item.to).meta;
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
