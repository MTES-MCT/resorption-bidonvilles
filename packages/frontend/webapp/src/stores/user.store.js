import { defineStore } from "pinia";
import { signin } from "@/api/signin.api";
import { get as refreshToken } from "@/api/refresh_token.api";
import { useConfigStore } from "@/stores/config.store.js";
import getDefaultLocationFilter from "@/utils/getDefaultLocationFilter";
import compareLocations from "@/utils/compareLocations";
import logout from "@/utils/logout";

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
        firstMainArea() {
            if (!this.user?.intervention_areas) {
                return null;
            }

            return this.user.intervention_areas.areas.find(
                (area) => area.is_main_area === true
            );
        },
        id() {
            return this.user?.id || null;
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
                return !this.user.intervention_areas.areas.find(
                    (area) => area.departement?.code === code
                );
            };
        },
        hasJusticePermission() {
            return this.hasPermission("shantytown_justice.access");
        },
        hasOwnerPermission() {
            return this.hasPermission("shantytown_owner.access");
        },
        hasUpdateShantytownPermission() {
            return (shantytown) =>
                this.hasLocalizedPermission("shantytown.update", shantytown);
        },
        hasAcceptedCharte() {
            return this.user?.charte_engagement_a_jour === true;
        },
        departementsForActions() {
            const configStore = useConfigStore();
            const { departements } = configStore.config;
            const permission = this.user.permissions.action.create;

            if (permission.allowed_on_national === true) {
                return departements;
            }

            const allowedDepartements = permission.allowed_on.departements.map(
                (d) => d.departement.code
            );
            const allowedRegions = permission.allowed_on.regions.map(
                (r) => r.region.code
            );
            return departements.filter(
                ({ code, region }) =>
                    allowedDepartements.includes(code) ||
                    allowedRegions.includes(region)
            );
        },
        hasMoreThanOneDepartementForMetrics() {
            const permission = this.user.permissions.shantytown.list;
            if (permission.allowed === false) {
                return false;
            }

            if (permission.allowed_on_national === true) {
                return true;
            }

            return (
                permission.allowed_on.departements.length > 1 ||
                permission.allowed_on.regions.length > 0
            );
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
            const [entity, feature] = permissionName.split(".");
            const permission = this.getPermission(`${entity}.${feature}`);

            return permission !== null;
        },
        hasLocalizedPermission(permissionName, entity) {
            const permission = this.getPermission(permissionName);
            if (permission === null) {
                return false;
            }

            if (permission.allowed_on_national === true) {
                return true;
            }

            if (!entity) {
                return false;
            }

            return (
                (entity.region &&
                    permission.allowed_on.regions.some(
                        (r) => r.region.code === entity.region.code
                    )) ||
                (entity.departement &&
                    permission.allowed_on.departements.some(
                        (d) => d.departement.code === entity.departement.code
                    )) ||
                (entity.epci &&
                    permission.allowed_on.epci.some(
                        (e) => e.epci.code === entity.epci.code
                    )) ||
                (entity.city &&
                    permission.allowed_on.cities.some(
                        (c) =>
                            c.city.code === entity.city.code ||
                            c.city.main === entity.city.code ||
                            c.city.code === entity.city.main ||
                            c.city.main === entity.city.main
                    ))
            );
        },
        hasActionPermission(permissionName, entity) {
            const permission = this.getPermission(permissionName);
            if (permission === null) {
                return false;
            }

            if (permission.allowed_on_national === true) {
                return true;
            }

            return (
                (entity.location.region &&
                    permission.allowed_on.regions.some(
                        (r) => r.region.code === entity.location.region.code
                    )) ||
                (entity.location.departement &&
                    permission.allowed_on.departements.some(
                        (d) =>
                            d.departement.code ===
                            entity.location.departement.code
                    )) ||
                permission.allowed_on.actions.includes(entity.id)
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
            const response = await refreshToken();
            if (response?.token) {
                this.setToken(response.token);
            } else {
                logout("/connexion?reason=invalid_token");
            }
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
