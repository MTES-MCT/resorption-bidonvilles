import { findAllByActor } from "#helpers/town";

export default {
  state: {
    state: null,
    error: null,
    myTowns: []
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

      try {
        const towns = await findAllByActor(user.id);
        commit("setMyTownsItems", towns);
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

    townsItems(state) {
      return state.myTowns;
    }
  }
};
