import { findUserTowns, findTown } from "#helpers/town";

export default {
    state: {
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
        setTownsError(state, error) {
            state.error = error;
        },
        setMyTownsItems(state, towns) {
            state.myTowns = towns;
            towns.forEach(town => {
                if (!state.hash[town.id]) {
                    state.hash[town.id] = town;
                }
            });
        },
        setConsultedTownsItems(state, towns) {
            state.consultedTowns = towns;
            towns.forEach(town => {
                if (!state.hash[town.id]) {
                    state.hash[town.id] = town;
                }
            });
        },
        setDetailedTown(state, townId) {
            if (!state.hash[townId]) {
                throw new Error("Impossible de trouver le site");
            }

            state.detailedTown = state.hash[townId];
        },

        SET_COMMENTS(state, { shantytown: shantytownId, comments }) {
            if (!state.hash[shantytownId]) {
                return;
            }

            state.hash[shantytownId].comments = comments;
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
        },

        async fetchShantytown({ state }, shantytownId) {
            // fetch locally first
            const town = state.hash[shantytownId];
            if (town !== undefined) {
                return town;
            }

            try {
                return await findTown(shantytownId);
            } catch (error) {
                console.log(error);
            }

            return null;
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
        },
        detailedTown(state) {
            return state.detailedTown;
        }
    }
};
