import { load } from "#frontend/common/api/config";

export default {
    namespaced: true,

    state: {
        configuration: null
    },

    mutations: {
        SET_CONFIG(state, configuration) {
            if (!configuration) {
                state.configuration = null;
            } else {
                state.configuration = configuration;
            }
        },
        SET_CHARTE_ENGAGEMENT_A_JOUR(state, value) {
            if (state.configuration !== null) {
                state.configuration.user.charte_engagement_a_jour =
                    value === true;
            }
        }
    },

    actions: {
        async load({ commit, dispatch }) {
            const response = await load();
            commit("SET_CONFIG", response);
            dispatch("user/refreshToken", null, { root: true });
            return response;
        },
        unload({ commit }) {
            commit("SET_CONFIG", null);
        }
    },
    getters: {
        loaded(state) {
            return state.configuration !== null;
        },
        hasAcceptedCharte(state) {
            if (state.configuration === null) {
                return false;
            }

            return state.configuration.user.charte_engagement_a_jour;
        },
        getPermission(state) {
            return permissionName => {
                if (
                    state.configuration === null ||
                    state.configuration.user === null
                ) {
                    return null;
                }

                const [entity, feature] = permissionName.split(".");
                if (
                    !Object.prototype.hasOwnProperty.call(
                        state.configuration.user.permissions,
                        entity
                    ) ||
                    !Object.prototype.hasOwnProperty.call(
                        state.configuration.user.permissions[entity],
                        feature
                    )
                ) {
                    return null;
                }

                const permission =
                    state.configuration.user.permissions[entity][feature];
                if (permission.allowed !== true) {
                    return null;
                }

                return permission;
            };
        },
        hasPermission(state, getters) {
            return permissionName => {
                const [entity, feature, data] = permissionName.split(".");
                const permission = getters.getPermission(
                    `${entity}.${feature}`
                );

                return (
                    permission !== null &&
                    (data === undefined || permission[data] === true)
                );
            };
        },
        hasLocalizedPermission(state, getters) {
            return (permissionName, town) => {
                const permission = getters.getPermission(permissionName);
                if (permission === null) {
                    return false;
                }

                if (permission.allow_all) {
                    return true;
                }

                return (
                    (town.region &&
                        permission.allowed_on.regions.includes(
                            town.region.code
                        )) ||
                    (town.departement &&
                        permission.allowed_on.departements.includes(
                            town.departement.code
                        )) ||
                    (town.epci &&
                        permission.allowed_on.epci.includes(town.epci.code)) ||
                    (town.city &&
                        (permission.allowed_on.cities.includes(
                            town.city.code
                        ) ||
                            permission.allowed_on.cities.includes(
                                town.city.main
                            ))) ||
                    permission.allowed_on.shantytowns.includes(town.id)
                );
            };
        }
    }
};
