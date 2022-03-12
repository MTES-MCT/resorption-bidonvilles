import { load, unload } from "#helpers/api/config";

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
            dispatch("refreshToken", null, { root: true });
            return response;
        },
        unload({ commit }) {
            commit("SET_CONFIG", null);
            unload();
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
        }
    }
};
