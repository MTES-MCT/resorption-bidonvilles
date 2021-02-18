import Vue from "vue";
import Vuex from "vuex";
import { all as fetchAll } from "#helpers/api/town";
import enrichShantytown from "#app/pages/TownsList/enrichShantytown";
import { get as getConfig } from "#helpers/api/config";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        towns: {
            data: [],
            loading: true,
            error: null,
            sort: "updatedAt",
            filters: {
                population: [],
                fieldType: [],
                justice: [],
                origin: [],
                conditions: [],
                status: "open",
                location: null
            },
            currentPage: 1
        }
    },
    mutations: {
        setLoading(state, value) {
            state.towns.loading = value;
        },
        setTowns(state, towns) {
            state.towns.data = towns;
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
        }
    },
    actions: {
        async fetchTowns({ commit }) {
            commit("setLoading", true);
            try {
                const { user, field_types: fieldTypes } = getConfig();

                if (
                    user.organization.location.type !== "nation" &&
                    !user.is_admin
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
        }
    },
    getters: {
        towns: state => {
            return state.towns.data;
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
