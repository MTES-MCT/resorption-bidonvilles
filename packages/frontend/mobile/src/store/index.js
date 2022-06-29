import Vue from "vue";
import Vuex from "vuex";
import api from "#src/js/api";
import moduleConfig from "#frontend/common/store/modules/config";
import moduleUser from "#frontend/common/store/modules/user";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user: moduleUser,
    config: moduleConfig,
  },
});
api.setStore(store);

export default store;
