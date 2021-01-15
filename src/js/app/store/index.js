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
            sort: "builtAt",
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
        setCurrentPage(state, page) {
            state.towns.currentPage = page;
        }
    },
    actions: {
        async fetchTowns({ commit }) {
            commit("setLoading", true);
            try {
                const { field_types: fieldTypes } = getConfig();
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
