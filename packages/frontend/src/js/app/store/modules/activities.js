import { listRegular } from "#helpers/api/userActivity";

export default {
    state: {
        loading: false,
        error: null,
        items: [],
        sort: "date",
        filters: {
            activityTypes: [],
            location: null
        },
        currentPage: 1,
        itemsPerPage: 5
    },

    mutations: {
        setActivitiesLoading(state, loading) {
            state.loading = loading;
        },
        setActivitiesError(state, error) {
            state.error = error;
        },
        setActivities(state, items) {
            state.items = items;
        },
        setActivitiesSort(state, sort) {
            state.sort = sort;
        },
        setActivityTypesFilter(state, filters) {
            state.filters.activityTypes = filters;
        },
        setActivityLocationFilter(state, location) {
            state.filters.location = location;
        },
        setActivitiesPage(state, page) {
            state.currentPage = page;
        },
        removeComment(state, commentId) {
            const index = state.items.findIndex(({ comment }) => {
                return comment && comment.id === commentId;
            });

            if (index >= 0) {
                state.items.splice(index, 1);
            }
        }
    },

    actions: {
        async fetchActivities({ commit }) {
            commit("setActivitiesLoading", true);
            commit("setActivitiesError", null);

            try {
                const activities = await listRegular();
                commit("setActivities", activities);
            } catch (error) {
                commit("setActivitiesError", "Une erreur est survenue");
            }

            commit("setActivitiesLoading", false);
        }
    },

    getters: {
        activities(state) {
            return state.items;
        },
        activitiesLoading(state) {
            return state.loading;
        },
        activitiesError(state) {
            return state.error;
        },
        activitiesFilteredItems(state) {
            const { filters } = state;

            return state.items.filter(item => {
                // activity type filter
                if (filters.activityTypes.length > 0) {
                    if (
                        !filters.activityTypes.includes(
                            `${item.entity}-${item.action}`
                        )
                    ) {
                        return false;
                    }
                }

                // location filter
                if (filters.location !== null) {
                    const { code, type } = filters.location.data;
                    if (item.shantytown) {
                        const shantytownLocation = item.shantytown[type];
                        const shantytownCode =
                            shantytownLocation.main || shantytownLocation.code;

                        return shantytownCode === code;
                    }

                    if (item.user) {
                        const userLocation = item.user.location[type];

                        const userCode = userLocation
                            ? userLocation.main || userLocation.code
                            : null;

                        return userCode === code;
                    }

                    return false;
                }

                return true;
            });
        }
    }
};
