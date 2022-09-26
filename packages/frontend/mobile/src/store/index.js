import Vue from "vue";
import Vuex from "vuex";
import api from "#src/js/api";
import moduleConfig from "#frontend/common/store/modules/config";
import moduleNotes from "./modules/notes";
import moduleTowns from "./modules/towns";
import moduleUser from "#frontend/common/store/modules/user";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        config: moduleConfig,
        notes: moduleNotes,
        towns: moduleTowns,
        user: moduleUser
    },
    state: {
        currentTab: "towns"
    },
    mutations: {
        setCurrentTab(state, value) {
            state.currentTab = value;
        }
    },
    getters: {
        currentTab(state) {
            return state.currentTab;
        }
    }
});
api.setStore(store);

export default store;
