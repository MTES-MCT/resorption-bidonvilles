import { defineStore } from "pinia";
import { signin } from "@/api/signin.api";
import { get as refreshToken } from "@/api/refresh_token.api";
import { useConfigStore } from "@/stores/config.store.js";
import getDefaultLocationFilter from "@/utils/getDefaultLocationFilter";
import compareLocations from "@/utils/compareLocations";

export const useUserStore = defineStore("user", {
    state: () => {
        const tokenCreatedAt = localStorage.getItem("tokenCreatedAt");
        return {
            accessToken: localStorage.getItem("token"),
            accessTokenCreatedAt:
                tokenCreatedAt !== null ? parseInt(tokenCreatedAt, 10) : null,
        };
    },
    getters: {
        isLoggedIn() {
            return this.accessToken !== null;
        },
        user() {
            const configStore = useConfigStore();
            return configStore.config?.user;
        },
        defaultLocationFilter() {
            return getDefaultLocationFilter(this.user);
        },
        isMyLocation() {
            return (location) => {
                return compareLocations(location, this.defaultLocationFilter);
            };
        },
        showDepartementCode() {
            return (code) => {
                const userLocation = this.user?.organization.location;
                if (["nation", "region"].includes(userLocation.type)) {
                    return true;
                }

                if (userLocation.departement?.code !== code) {
                    return true;
                }

                return false;
            };
        },
        hasJusticePermission() {
            return this.hasPermission("shantytown_justice.access");
        },
        hasUpdateShantytownPermission() {
            return (shantytown) =>
                this.hasLocalizedPermission("shantytown.update", shantytown);
        },
        hasAcceptedChart() {
            if (!this.user) {
                return false;
            }

            return this.user.charte_engagement_a_jour;
        },
    },
    actions: {
        getPermission(permissionName) {
            const [entity, feature] = permissionName.split(".");
            if (
                !this.user?.permissions[entity] ||
                !this.user?.permissions[entity][feature]
            ) {
                return null;
            }

            const permission = this.user.permissions[entity][feature];
            if (permission.allowed !== true) {
                return null;
            }

            return permission;
        },
        hasPermission(permissionName) {
            const [entity, feature, data] = permissionName.split(".");
            const permission = this.getPermission(`${entity}.${feature}`);

            return (
                permission !== null &&
                (data === undefined || permission[data] === true)
            );
        },
        hasLocalizedPermission(permissionName, town) {
            const permission = this.getPermission(permissionName);
            if (permission === null) {
                return false;
            }

            if (permission.allow_all) {
                return true;
            }

            return (
                (town.region &&
                    permission.allowed_on.regions.includes(town.region.code)) ||
                (town.departement &&
                    permission.allowed_on.departements.includes(
                        town.departement.code
                    )) ||
                (town.epci &&
                    permission.allowed_on.epci.includes(town.epci.code)) ||
                (town.city &&
                    (permission.allowed_on.cities.includes(town.city.code) ||
                        permission.allowed_on.cities.includes(
                            town.city.main
                        ))) ||
                permission.allowed_on.shantytowns.includes(town.id)
            );
        },
        setToken(token) {
            const now = Date.now();
            localStorage.setItem("token", token);
            localStorage.setItem("tokenCreatedAt", now);
            this.accessToken = token;
            this.accessTokenCreatedAt = now;
        },
        async signin(email, password) {
            const { token } = await signin(email, password);
            this.setToken(token);
        },
        async refreshToken() {
            const { token } = await refreshToken();
            this.setToken(token);
        },
        signout() {
            const configStore = useConfigStore();
            configStore.unload();
            localStorage.removeItem("token");
            localStorage.removeItem("tokenCreatedAt");
            this.accessToken = null;
            this.accessTokenCreatedAt = null;
        },
    },
});
