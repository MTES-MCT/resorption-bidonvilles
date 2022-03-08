import getSince from "#app/utils/getSince";

export default {
    namespaced: true,

    state: {
        dashboard: {
            shantytowns: {
                filter: "my_shantytowns",
                display: "thumbnail",
                page: 1,
                mapSetup: {
                    center: [46.7755829, 2.0497727],
                    zoom: 6
                }
            },
            activities: {
                filter: "comment_creation"
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
        setDashboardShantytownsDisplay(state, display) {
            state.dashboard.shantytowns.display = display;
        },
        setDashboardShantytownsMapSetup(state, setup) {
            state.dashboard.shantytowns.mapSetup = setup;
        },
        setDashboardActivitiesFilter(state, filter) {
            state.dashboard.activities.filter = filter;
        }
    },

    getters: {
        dashboardShantytownsFilter(state) {
            return state.dashboard.shantytowns.filter;
        },
        dashboardShantytownsCurrentPage(state) {
            return state.dashboard.shantytowns.page;
        },

        dashboardShantytownsDisplay(state) {
            return state.dashboard.shantytowns.display;
        },
        DashboardShantytownsMapSetup(state) {
            return state.dashboard.shantytowns.mapSetup;
        },
        dashboardMyShantytowns(state, getters, rootState) {
            const { user } = rootState.config.configuration;

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
        },
        activities(state, getters, rootState, rootGetters) {
            return rootGetters.activities.reduce((acc, argActivity) => {
                const activity = { ...argActivity };
                if (activity.user) {
                    const lastActivity = acc.slice(-1)[0];
                    if (lastActivity && lastActivity.users) {
                        const newAcc = [...acc];
                        newAcc[newAcc.length - 1].users.push(activity.user);
                        return newAcc;
                    }

                    activity.users = [activity.user];
                    delete activity.user;
                }

                if (
                    activity.entity === "shantytown" &&
                    activity.action === "update"
                ) {
                    const updates = activity.diff.reduce((diffAcc, diff) => {
                        if (
                            !["accessToWater", "electricityType"].includes(
                                diff.fieldKey
                            )
                        ) {
                            return diffAcc;
                        }

                        const oldValue = diff.oldValue.toLowerCase();
                        const newValue = diff.newValue.toLowerCase();
                        let action = null;

                        if (oldValue !== "oui" && newValue === "oui") {
                            action = "creation";
                        } else if (oldValue === "oui" && newValue !== "oui") {
                            action = "closing";
                        } else {
                            return diffAcc;
                        }

                        return [
                            ...diffAcc,
                            {
                                entity:
                                    diff.fieldKey === "electricityType"
                                        ? "electricity"
                                        : "water",
                                action,
                                date: activity.date,
                                shantytown: activity.shantytown
                            }
                        ];
                    }, []);

                    if (updates.length === 0) {
                        return acc;
                    }

                    return [...acc, ...updates];
                }

                return [...acc, activity];
            }, []);
        }
    }
};
