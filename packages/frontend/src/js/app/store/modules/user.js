import { login, refreshToken } from "#helpers/api/user";
import { unload as unloadConfig } from "#helpers/api/config";

export default {
    state: {
        loggedIn: false
    },

    mutations: {
        SET_ACCESS_TOKEN(state, token) {
            if (!token) {
                localStorage.removeItem("token");
                state.loggedIn = false;
            } else {
                localStorage.setItem("token", token);
                state.loggedIn = token !== null;
                console.log("=====TOKEN SET FROM store/modules/user.SET_ACCESS_TOKEN !=====");
                console.log(`state.loggedIn is ${state.loggedIn}`);
            }
        }
    },

    actions: {
        async login({ commit }, { email, password }) {
            const response = await login(email, password);
            console.log(`response.token: ${response.token}`);
            commit("SET_ACCESS_TOKEN", response.token);
            console.log(
                `=====Valeur de token: ${localStorage.getItem("token")}`
            );
        },

        async refreshToken({ commit }) {
            const response = await refreshToken();
            commit("SET_ACCESS_TOKEN", response.token);
            console.log("=====TOKEN REFRESHED !=====");
        },

        logout({ commit }, piwik) {
            unloadConfig();
            commit("SET_ACCESS_TOKEN", null);
            console.log("=====TOKEN UNSET !=====");
            console.log(`state.loggedIn is ${this.state.loggedIn}`);

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
