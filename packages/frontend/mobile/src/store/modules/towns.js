import { findUserTowns } from "#helpers/town";

export default {
    state: {
        navigationState: "liste-des-sites",
        state: null,
        error: null,
        hash: {},
        myTowns: [],
        consultedTowns: [],
        detailedTown: null
    },

    mutations: {
        setTownsState(state, s) {
            state.state = s;
        },
        setNavigationState(state, s) {
            state.navigationState = s;
        },
        setTownsError(state, error) {
            state.error = error;
        },
        setMyTownsItems(state, towns) {
            state.myTowns = towns;
            towns.forEach(({ id }, index) => {
                if (!state.hash[id]) {
                    state.hash[id] = { type: "actor", index: index };
                }
            });
        },
        setConsultedTownsItems(state, towns) {
            state.consultedTowns = towns;
            towns.forEach(({ id }, index) => {
                if (!state.hash[id]) {
                    state.hash[id] = { type: "navigation_log", index: index };
                }
            });
        },
        setDetailedTown(state, townId) {
            if (!state.hash[townId]) {
                throw new Error("Impossible de trouver le site");
            }
            state.navigationState = `site/${townId}`;
            switch (state.hash[townId].type) {
                case "actor":
                    state.detailedTown =
                        state.myTowns[state.hash[townId].index];
                    break;
                case "navigation_log":
                    state.detailedTown =
                        state.consultedTowns[state.hash[townId].index];
                    break;
                default:
            }
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
                const myTowns = await findUserTowns(user.id, "actors");
                const consultedTowns = await findUserTowns(
                    user.id,
                    "navigation_logs"
                );
                commit("setMyTownsItems", myTowns);
                commit("setConsultedTownsItems", consultedTowns);
                commit("setTownsState", "loaded");
            } catch (error) {
                commit(
                    "setTownsError",
                    (error && error.user_message) ||
                        "Une erreur inconnue est survenue"
                );
                commit("setTownsState", "error");
            }
        }
    },

    getters: {
        navigationState(state) {
            return state.navigationState;
        },
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
        },
        detailedTown(state) {
            return state.detailedTown;
        }
    }
};
