import { login, refreshToken } from "#frontend/common/api/user.js";

export default {
    namespaced: true,

    state: {
        accessToken: import.meta.env.SSR ? null : localStorage.getItem("token")
    },

    mutations: {
        SET_ACCESS_TOKEN(state, token) {
            if (!token) {
                localStorage.removeItem("token");
                state.accessToken = null;
            } else {
                localStorage.setItem("token", token);
                state.accessToken = token;
            }
        }
    },

    actions: {
        async login({ commit }, { email, password }) {
            const response = await login(email, password);
            commit("SET_ACCESS_TOKEN", response.token);
        },

        async refreshToken({ commit }) {
            const response = await refreshToken();
            commit("SET_ACCESS_TOKEN", response.token);
        },

        async logout({ commit, dispatch }, piwik) {
            await dispatch("config/unload", null, { root: true });
            commit("SET_ACCESS_TOKEN", null);

            if (piwik) {
                piwik.resetUserId();
                piwik.setCustomVariable(1, "user", null);
                piwik.setCustomVariable(5, "departement_code", null);
            }
        }
    },
    getters: {
        loggedIn(state) {
            return state.accessToken !== null;
        }
    }
};