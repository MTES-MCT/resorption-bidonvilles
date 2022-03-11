import { login, refreshToken } from "#helpers/api/user";

export default {
    state: {
        accessToken: process.isServer ? null : localStorage.getItem("token")
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

        logout({ commit, dispatch }, piwik) {
            dispatch("unloadConfig");
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
