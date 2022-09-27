import Vue from "vue";
import Vuex from "vuex";
import api from "#src/js/api";
import moduleConfig from "#frontend/common/store/modules/config";
import moduleNotes from "./modules/notes";
import moduleSearch from "./modules/search";
import moduleTowns from "./modules/towns";
import moduleUser from "#frontend/common/store/modules/user";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        config: moduleConfig,
        notes: moduleNotes,
        search: moduleSearch,
        towns: moduleTowns,
        user: moduleUser
    }
});
api.setStore(store);

export default store;
