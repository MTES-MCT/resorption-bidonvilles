import { get as getConfig } from "#helpers/api/config";
import getSince from "#app/utils/getSince";

export default {
    state: {
        dashboard: {
            shantytowns: {
                filter: "my_shantytowns",
                sort: "updatedAt",
                page: 1
            }
        }
    },

    mutations: {
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
        }
    },

    getters: {
        dashboardShantytownsFilter(state) {
            return state.dashboard.shantytowns.filter;
        },
        dashboardShantytownsCurrentPage(state) {
            return state.dashboard.shantytowns.page;
        },
        dashboardShantytownsSort(state) {
            return state.dashboard.shantytowns.sort;
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
    }
};
