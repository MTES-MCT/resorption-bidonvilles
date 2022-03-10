import { login, refreshToken } from "#helpers/api/user";
import { unload as unloadConfig } from "#helpers/api/config";

export default {
    state: {
        loggedIn: localStorage.getItem("token") !== null
    },

    mutations: {
        SET_ACCESS_TOKEN(state, token) {
            if (!token) {
                localStorage.removeItem("token");
                state.loggedIn = false;
            } else {
                localStorage.setItem("token", token);
                state.loggedIn = token !== null;
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

        logout({ commit }, piwik) {
            unloadConfig();
            commit("SET_ACCESS_TOKEN", null);

            if (piwik) {
                piwik.resetUserId();
                piwik.setCustomVariable(1, "user", null);
                piwik.setCustomVariable(5, "departement_code", null);
            }
        }
    },

    getters: {
        accessToken() {
            if (process.isServer) {
                return false;
            }

            return localStorage.getItem("token");
        }
    }
};
