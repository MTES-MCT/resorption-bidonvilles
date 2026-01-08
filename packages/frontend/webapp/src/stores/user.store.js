import { defineStore } from "pinia";
import { signin } from "@/api/signin.api";
import { checkActualPassword } from "@/api/checkActualPassword.api";
import { get as refreshToken } from "@/api/refresh_token.api";
import { useConfigStore } from "@/stores/config.store.js";
import getDefaultLocationFilter from "@/utils/getDefaultLocationFilter";
import compareLocations from "@/utils/compareLocations";
import logout from "@/utils/logout";

function getAllowedDepartements(permission) {
    const configStore = useConfigStore();
    const { departements } = configStore.config;
    if (permission.allowed_on_national === true) {
        return departements;
    }

    const allowedDepartements = new Set([
        ...permission.allowed_on.cities.map((c) => c.departement.code),
        ...permission.allowed_on.epci.map((e) => e.departement.code),
        ...permission.allowed_on.departements.map((d) => d.departement.code),
    ]);
    const allowedRegions = new Set(
        permission.allowed_on.regions.map((r) => r.region.code)
    );
    return departements.filter(
        ({ code, region }) =>
            allowedDepartements.has(code) || allowedRegions.has(region)
    );
}

function getDepartementsFromInterventionAreas(user) {
    const configStore = useConfigStore();
    const departements = configStore.config?.departements || [];

    if (!user || user.intervention_areas?.is_national === true) {
        return departements;
    }

    const codes = new Set();
    (user.intervention_areas?.areas || []).forEach((area) => {
        if (!area?.type) {
            return;
        }

        if (area.type === "departement" && area.departement?.code) {
            codes.add(area.departement.code);
            return;
        }

        if (area.type === "region" && area.region?.code) {
            departements
                .filter((d) => d.region === area.region.code)
                .forEach((d) => codes.add(d.code));
            return;
        }

        if (
            (area.type === "epci" || area.type === "city") &&
            area.departement?.code
        ) {
            codes.add(area.departement.code);
        }
    });

    return departements.filter((d) => codes.has(d.code));
}

function mergeDepartements(a, b) {
    const byCode = new Map();
    (a || []).forEach((d) => byCode.set(d.code, d));
    (b || []).forEach((d) => byCode.set(d.code, d));
    return Array.from(byCode.values());
}

export const useUserStore = defineStore("user", {
    state: () => {
        const tokenCreatedAt = localStorage.getItem("tokenCreatedAt");
        return {
            accessToken: localStorage.getItem("token"),
            accessTokenCreatedAt:
                tokenCreatedAt === null
                    ? null
                    : Number.parseInt(tokenCreatedAt, 10),
        };
    },
    getters: {
        defaultLocationFilter() {
            return getDefaultLocationFilter(this.user);
        },
        departementsForActions() {
            const permission = this.user.permissions.action.create;
            return getAllowedDepartements(permission);
        },
        departementsForMetrics() {
            const permission = this.user.permissions.shantytown.list;
            return mergeDepartements(
                getAllowedDepartements(permission),
                getDepartementsFromInterventionAreas(this.user)
            );
        },
        firstMainArea() {
            if (!this.user?.intervention_areas) {
                return null;
            }

            return this.user.intervention_areas.areas.find((area) => {
                return area.is_main_area === true;
            });
        },
        hasAcceptedCharte() {
            return this.user?.charte_engagement_a_jour === true;
        },
        hasJusticePermission() {
            return this.hasPermission("shantytown_justice.access");
        },
        hasMoreThanOneDepartementForMetrics() {
            if (!this.user?.permissions?.shantytown?.list?.allowed) {
                return false;
            }

            if (this.user.intervention_areas?.is_national === true) {
                return true;
            }

            return this.departementsForMetrics.length > 1;
        },
        hasOwnerPermission() {
            return this.hasPermission("shantytown_owner.access");
        },
        hasUpdateShantytownPermission() {
            return (shantytown) =>
                this.hasLocalizedPermission("shantytown.update", shantytown);
        },
        id() {
            return this.user?.id || null;
        },
        isLoggedIn() {
            return this.accessToken !== null;
        },
        isMyLocation() {
            return (location) => {
                return compareLocations(location, this.defaultLocationFilter);
            };
        },
        user() {
            const configStore = useConfigStore();
            // Ajouter "metropole" si l'utilisateur a un accès national
            if (configStore.config?.user?.intervention_areas.is_national) {
                return {
                    ...configStore.config.user,
                    intervention_areas: {
                        ...configStore.config.user.intervention_areas,
                        areas: [
                            {
                                is_main_area: true,
                                type: "metropole",
                                latitude: 46.7755829,
                                longitude: 2.0497727,
                                metropole: {
                                    code: "metropole",
                                    name: "Hexagone",
                                },
                            },
                            {
                                is_main_area: true,
                                type: "outremer",
                                latitude: 46.7755829,
                                longitude: 2.0497727,
                                outremer: {
                                    code: "outremer",
                                    name: "Outremer",
                                },
                            },
                            ...configStore.config.user.intervention_areas.areas,
                        ],
                    },
                };
            }
            return configStore.config?.user;
        },
        showDepartementCode() {
            return (code) => {
                return !this.user.intervention_areas.areas.some(
                    (area) => area.departement?.code === code
                );
            };
        },
    },
    actions: {
        async checkActualPassword(email, password) {
            const response = await checkActualPassword(this.user.id, password);
            return response;
        },
        getPermission(permissionName) {
            const [entity, feature] = permissionName.split(".");
            if (!this.user?.permissions[entity]?.[feature]) {
                return null;
            }

            const permission = this.user.permissions[entity][feature];
            if (permission.allowed !== true) {
                return null;
            }

            return permission;
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
        hasPermission(permissionName) {
            const [entity, feature] = permissionName.split(".");
            const permission = this.getPermission(`${entity}.${feature}`);

            return permission !== null;
        },
        async refreshToken() {
            const response = await refreshToken();
            if (response?.token) {
                this.setToken(response.token);
            } else {
                logout("/connexion?reason=invalid_token");
            }
        },
        setPasswordConformity(conformity) {
            this.user.password_conformity = conformity;
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
