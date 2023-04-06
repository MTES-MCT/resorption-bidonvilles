import { findUserTowns, findTown } from "#helpers/town";
import enrichShantytown from "#frontend/common/helpers/town/enrichShantytown";

export default {
    state: {
        state: null,
        error: null,
        hash: {},
        myTowns: [],
        consultedTowns: [],
        nearbyTowns: [],
        commentsAreOpen: false,
        commentsScroll: 0,
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
            towns.forEach((town) => {
                if (!state.hash[town.id]) {
                    state.hash[town.id] = town;
                }
            });
        },
        setConsultedTownsItems(state, towns) {
            state.consultedTowns = towns;
            towns.forEach((town) => {
                if (!state.hash[town.id]) {
                    state.hash[town.id] = town;
                }
            });
        },
        SET_NEARBY_TOWNS_ITEMS(state, nearbyTowns) {
            state.nearbyTowns = nearbyTowns;
            nearbyTowns.forEach((nearbyTown) => {
                if (!state.hash[nearbyTown.id]) {
                    state.hash[nearbyTown.id] = nearbyTown;
                }
            });
        },
        SET_COMMENTS_SCROLL(state, scroll) {
            state.commentsScroll = scroll;
        },

        SET_COMMENTS_ARE_OPEN(state, areOpen) {
            state.commentsAreOpen = areOpen;
        },

        SET_COMMENTS(state, { shantytown: shantytownId, comments }) {
            if (!state.hash[shantytownId]) {
                return;
            }

            state.hash[shantytownId].comments = comments;
        },
    },

    actions: {
        async fetchTowns({ state, commit, rootState }) {
            const { user, field_types: fieldTypes } =
                rootState.config.configuration;
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
                commit(
                    "setMyTownsItems",
                    myTowns.map((s) => enrichShantytown(s, fieldTypes))
                );
                commit(
                    "setConsultedTownsItems",
                    consultedTowns.map((s) => enrichShantytown(s, fieldTypes))
                );
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

        async setNearbyTowns({ commit, rootState }, towns) {
            commit("SET_NEARBY_TOWNS_ITEMS", []);
            const { field_types: fieldTypes } = rootState.config.configuration;
            commit(
                "SET_NEARBY_TOWNS_ITEMS",
                towns.map((s) => enrichShantytown(s, fieldTypes))
            );
        },

        async fetchShantytown({ state, rootState }, shantytownId) {
            const { field_types: fieldTypes } = rootState.config.configuration;
            // fetch locally first
            const town = state.hash[shantytownId];
            if (town !== undefined) {
                return town;
            }

            try {
                const rawTown = await findTown(shantytownId);
                const town = enrichShantytown(rawTown, fieldTypes);
                state.hash[town.id] = town;
                return town;
            } catch (error) {
                throw new Error("Impossible de trouver le site");
            }
        },
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
        nearbyTowns(state) {
            return state.nearbyTowns;
        },
    },
};
