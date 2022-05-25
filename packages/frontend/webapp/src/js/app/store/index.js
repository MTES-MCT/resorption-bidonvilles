import Vue from "vue";
import Vuex from "vuex";
import {
    all as fetchAll,
    get as fetchOne,
    addActor,
    removeActor,
    updateActorThemes,
    removeActorTheme,
    inviteNewActor
} from "#helpers/api/town";
import enrichShantytown from "#app/pages/TownsList/enrichShantytown";

import activities from "./modules/activities";
import dashboard from "./modules/dashboard";
import locations from "./modules/locations";
import directory from "./modules/directory";
import highCovidComments from "./modules/highCovidComments";
import navigation from "./modules/navigation/navigation";
import plans from "./modules/plans";
import shantytownComments from "./modules/shantytownComments";
import userModule from "./modules/user";
import config from "./modules/config";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        activities,
        dashboard,
        locations,
        directory,
        highCovidComments,
        navigation,
        plans,
        shantytownComments,
        user: userModule,
        config
    },
    state: {
        entrypoint: null,
        towns: {
            data: [],
            hash: {}, // an hash-table matching townId to an index in data
            loading: true,
            error: null,
            sort: "updatedAt",
            filters: {
                population: [],
                fieldType: [],
                justice: [],
                origin: [],
                conditions: [],
                closingReason: [],
                solvedOrClosed: [],
                status: "open",
                location: null,
                actors: [],
                target: [],
                search: ""
            },
            currentPage: 1
        },
        detailedTown: null
    },
    mutations: {
        setEntrypoint(state, value) {
            state.entrypoint = value;
        },
        setLoading(state, value) {
            state.towns.loading = value;
        },
        setTowns(state, towns) {
            state.towns.data = towns;
            state.towns.hash = towns.reduce(
                (hash, { id }, index) => ({
                    ...hash,
                    [id]: index
                }),
                {}
            );
        },
        setError(state, err) {
            state.towns.error = err;
        },
        setSort(state, sort) {
            state.towns.sort = sort;
        },
        setFilters(state, filters) {
            state.towns.filters = filters;
        },
        setLocation(state, location) {
            state.towns.filters.location = location;
        },
        setCurrentPage(state, page) {
            state.towns.currentPage = page;
        },
        setDetailedTown(state, town) {
            state.detailedTown = town;

            const index = state.towns.hash[town.id];
            if (index !== undefined) {
                state.towns.data[index] = town;
            }
        },
        updateShantytownComments(state, { townId, comments }) {
            if (
                state.detailedTown !== null &&
                state.detailedTown.id === townId
            ) {
                state.detailedTown.comments = comments;
            }

            const index = state.towns.hash[townId];
            if (index !== undefined) {
                state.towns.data.splice(index, 1, {
                    ...state.towns.data[index],
                    comments: comments
                });
            }
        },
        updateShantytownActors(state, { townId, actors }) {
            if (
                state.detailedTown !== null &&
                state.detailedTown.id === townId
            ) {
                state.detailedTown.actors = actors;
            }

            const index = state.towns.hash[townId];
            if (index !== undefined) {
                state.towns.data.splice(index, 1, {
                    ...state.towns.data[index],
                    actors: actors
                });
            }
        },
        updateShantytownActorThemes(state, { townId, userId, themes }) {
            if (
                state.detailedTown !== null &&
                state.detailedTown.id === townId
            ) {
                const actor = state.detailedTown.actors.find(
                    ({ id }) => id === userId
                );
                if (actor !== undefined) {
                    actor.themes = themes;
                }
            }

            const index = state.towns.hash[townId];
            if (index !== undefined) {
                const actor = state.towns.data[index].actors.find(
                    ({ id }) => id === userId
                );
                if (actor !== undefined) {
                    actor.themes = themes;
                }
            }
        },
        saveHost(currentState, host) {
            let index = currentState.hosts.findIndex(
                h => h.email == host.email
            );
            if (index == -1) {
                currentState.hosts.push(host);
            } else {
                Vue.set(currentState.hosts, index, host);
            }
        }
    },
    actions: {
        async fetchTowns({ commit, state }) {
            commit("setLoading", true);
            try {
                const {
                    user,
                    field_types: fieldTypes
                } = state.config.configuration;

                if (
                    user.organization.location.type !== "nation" &&
                    user.role_id !== "national_admin"
                ) {
                    commit("setLocation", {
                        id:
                            user.organization.location[
                                user.organization.location.type
                            ].code,
                        label:
                            user.organization.location[
                                user.organization.location.type
                            ].name,
                        category: user.organization.location.type,
                        locationType: user.organization.location.type,
                        code:
                            user.organization.location[
                                user.organization.location.type
                            ].code,
                        data: {
                            code:
                                user.organization.location[
                                    user.organization.location.type
                                ].code,
                            type: user.organization.location.type
                        }
                    });
                }

                const originalTowns = await fetchAll();
                const towns = originalTowns.map(s =>
                    enrichShantytown(s, fieldTypes)
                );
                commit("setTowns", towns);
                commit("setLoading", false);
            } catch (err) {
                commit("setError", err);
                commit("setLoading", false);
            }
        },

        async fetchTownDetails({ commit, state }, id) {
            const town = enrichShantytown(
                await fetchOne(id),
                state.config.configuration.field_types
            );
            commit("setDetailedTown", town);
        },

        async addTownActor({ commit }, { townId, actor }) {
            const response = await addActor(townId, actor);

            // response.actors is not defined when an actor other than the connected user is added (we send an email to get his confirmation instead)
            if (response && response.actors) {
                commit("updateShantytownActors", {
                    townId,
                    actors: response.actors
                });
            }
        },

        async removeTownActor({ commit }, { townId, userId }) {
            const { actors } = await removeActor(townId, userId);
            commit("updateShantytownActors", { townId, actors });
        },

        async updateTownActorThemes({ commit }, { townId, userId, themes }) {
            const { themes: updatedThemes } = await updateActorThemes(
                townId,
                userId,
                themes
            );
            commit("updateShantytownActorThemes", {
                townId,
                userId,
                themes: updatedThemes
            });
        },

        async removeTownActorTheme({ commit }, { townId, userId, themeId }) {
            const { themes } = await removeActorTheme(townId, userId, themeId);
            commit("updateShantytownActorThemes", {
                townId,
                userId,
                themes
            });
        },

        inviteNewTownActor(args, { townId, email }) {
            return inviteNewActor(townId, email);
        },

        setDetailedTown({ commit }, town) {
            commit("setDetailedTown", town);
        }
    },
    getters: {
        towns: state => {
            return state.towns.data;
        },
        detailedTown: state => {
            return state.detailedTown;
        },
        townsLoading: state => {
            return state.towns.loading;
        },
        townsError: state => {
            return state.towns.error;
        },
        townsFilters: state => {
            return state.towns.filters;
        },
        townsSort: state => {
            return state.towns.sort;
        },
        townsCurrentPage: state => {
            return state.towns.currentPage;
        }
    }
});
