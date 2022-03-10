import { load } from "#helpers/api/config";

export default {
    state: {
        loaded: false
    },

    mutations: {
        SET_LOADED(state, configuration) {
            if (!configuration) {
                state.loaded = false;
            } else {
                state.loaded = configuration !== null;
                console.log("=====CONFIGURATION SET FROM store/modules/config.SET_CONFIG !=====");
                console.log(`state.loaded is ${state.loaded}`);
            }
        }
    },

    actions: {
        async updateLoaded({ commit, dispatch }) {
            const response = await load();
            console.log(`response from store/config/updateLoaded: ${JSON.stringify(response)}`);
            commit("SET_LOADED", response);
            dispatch("refreshToken");
        }
    }
};
