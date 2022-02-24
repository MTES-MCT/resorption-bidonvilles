import { get as getConfig } from "#helpers/api/config";
import getSince from "#app/utils/getSince";
import formatStats from "#app/utils/formatStats";
import { getDashboardStats } from "#helpers/api/dashboard";
export default {
    state: {
        dashboard: {
            shantytowns: {
                filter: "my_shantytowns",
                sort: "updatedAt",
                display: "thumbnail",
                page: 1,
                mapSetup: {
                    center: [46.7755829, 2.0497727],
                    zoom: 6
                }
            },
            globalStats: {
                data: [],
                error: null,
                isLoading: false
            }
        }
    },

    mutations: {
        setGlobalStats(state, stats) {
            state.dashboard.globalStats.data = stats;
        },
        setGlobalStatsError(state, error) {
            state.dashboard.globalStats.error = error;
        },
        setGlobalStatsLoading(state, value) {
            state.dashboard.globalStats.isLoading = value;
        },
        setDashboardShantytownsFilter(state, filter) {
            state.dashboard.shantytowns.page = 1;
            state.dashboard.shantytowns.filter = filter;
        },
        setDashboardShantytownsPage(state, page) {
            state.dashboard.shantytowns.page = page;
        },
        setDashboardShantytownsSort(state, sort) {
            state.dashboard.shantytowns.page = 1;
            state.dashboard.shantytowns.sort = sort;
        },
        setDashboardShantytownsDisplay(state, display) {
            state.dashboard.shantytowns.page = 1;
            state.dashboard.shantytowns.display = display;
        },
        setDashboardShantytownsMapSetup(state, setup) {
            state.dashboard.shantytowns.mapSetup = setup;
        }
    },

    getters: {
        dashboardGlobalStatsLoading: state => {
            return state.dashboard.globalStats.loading;
        },
        dashboardGlobalStats(state) {
            return state.dashboard.globalStats.data;
        },
        dashboardGlobalStatsError(state) {
            return state.dashboard.globalStats.error;
        },
        dashboardShantytownsFilter(state) {
            return state.dashboard.shantytowns.filter;
        },
        dashboardShantytownsCurrentPage(state) {
            return state.dashboard.shantytowns.page;
        },
        dashboardShantytownsSort(state) {
            return state.dashboard.shantytowns.sort;
        },
        dashboardShantytownsDisplay(state) {
            return state.dashboard.shantytowns.display;
        },
        DashboardShantytownsMapSetup(state) {
            return state.dashboard.shantytowns.mapSetup;
        },
        dashboardMyShantytowns(state, getters, rootState) {
            const { user } = getConfig();

            return rootState.towns.data.filter(town => {
                return (
                    town.status === "open" &&
                    town.actors.some(({ id }) => id === user.id)
                );
            });
        },
        dashboardNewShantytowns(state, getters, rootState) {
            return rootState.towns.data.filter(town => {
                if (town.status !== "open") {
                    return false;
                }

                const { days } = getSince(town.createdAt);
                return days < 30;
            });
        },
        dashboardMyTerritory(state, getters, rootState) {
            return rootState.towns.data.filter(town => town.status === "open");
        },
        dashboardContent(state, getters) {
            if (state.dashboard.shantytowns.filter === "my_territory") {
                return getters.dashboardMyTerritory;
            }

            if (state.dashboard.shantytowns.filter === "new_shantytowns") {
                return getters.dashboardNewShantytowns;
            }

            return getters.dashboardMyShantytowns;
        }
    },
    actions: {
        async fetchGlobalStats({ commit }) {
            commit("setGlobalStatsLoading", true);
            try {
                const stats = await getDashboardStats();
                commit("setGlobalStatsLoading", false);
                commit("setGlobalStats", formatStats(stats));
            } catch (error) {
                commit("setGlobalStatsLoading", false);
                commit(
                    "setGlobalStatsError",
                    (error && error.user_message) || "Une erreur est survenue"
                );
            }
        }
    }
};
