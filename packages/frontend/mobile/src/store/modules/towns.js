import { findAllByActor, findByNavigationLog } from "#helpers/town";

export default {
  state: {
    state: null,
    error: null,
    myTowns: [],
    consultedTowns: []
  },

  mutations: {
    setTownsState(state, s) {
      state.state = s;
    },
    setTownsError(state, error) {
      state.error = error;
    },
    setMyTownsItems(state, towns) {
      state.myTowns = towns;
    },
    setConsultedTownsItems(state, towns) {
      state.consultedTowns = towns;
    }
  },

  actions: {
    async fetchTowns({ state, commit, rootState }) {
      const { user } = rootState.config.configuration;
      if (state.state === "loading") {
        return;
      }

      commit("setTownsState", "loading");
      commit("setTownsError", null);
      commit("setMyTownsItems", []);
      commit("setConsultedTownsItems", []);

      try {
        const myTowns = await findAllByActor(user.id);
        const consultedTowns = await findByNavigationLog(user.id);
        commit("setMyTownsItems", myTowns);
        commit("setConsultedTownsItems", consultedTowns);
        commit("setTownsState", "loaded");
      } catch (error) {
        commit(
          "setTownsError",
          (error && error.user_message) || "Une erreur inconnue est survenue"
        );
        commit("setTownsState", "error");
      }
    }
  },

  getters: {
    townsState(state) {
      return state.state;
    },
    townsError(state) {
      return state.error;
    },

    myTowns(state) {
      return state.myTowns;
    },
    consultedTowns(state) {
      return state.consultedTowns;
    }
  }
};
