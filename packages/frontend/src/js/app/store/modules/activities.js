import { listRegular } from "#helpers/api/userActivity";

export default {
    state: {
        loading: false,
        error: null,
        items: [],
        lastActivityDate: new Date(),
        filters: {
            activityTypes: [],
            location: null
        },
        loaded: {
            locationType: null,
            locationCode: null,
            filters: ""
        },
        endOfActivities: false
    },

    mutations: {
        setActivitiesLoadedSignature(state, signature) {
            state.loaded.locationType = signature.locationType;
            state.loaded.locationCode = signature.locationCode;
            state.loaded.filters = signature.filters;
        },
        setActivitiesLoading(state, loading) {
            state.loading = loading;
        },
        setActivitiesError(state, error) {
            state.error = error;
        },
        setActivities(state, items) {
            state.items = items;
        },
        setActivitiesLastDate(state, date) {
            state.lastActivityDate = date;
        },
        setActivitiesEndReached(state, reached) {
            this.endOfActivities = reached === true;
        },
        setActivityTypesFilter(state, filters) {
            state.filters.activityTypes = filters;
        },
        setActivityLocationFilter(state, location) {
            state.filters.location = location;
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
        async fetchActivities({ commit, state }, location = null) {
            commit("setActivitiesLoading", true);
            commit("setActivitiesError", null);

            if (location !== null) {
                commit("setActivitiesLastDate", Date.now() / 1000);
                commit("setActivitiesEndReached", false);
                commit("setActivities", []);
                commit("setActivitiesLoadedSignature", {
                    locationType: location.locationType,
                    locationCode: location.locationCode,
                    filters: state.filters.activityTypes
                        .map(v => v.split("_"))
                        .flat()
                });
            }

            try {
                const activities = await listRegular(
                    state.lastActivityDate * 1000,
                    state.loaded.filters,
                    50,
                    state.loaded.locationType,
                    state.loaded.locationCode
                );

                if (activities.length > 0) {
                    commit(
                        "setActivitiesLastDate",
                        activities.slice(-1)[0].date
                    );
                } else {
                    commit("setActivitiesEndReached", true);
                }

                commit("setActivities", [...state.items, ...activities]);
            } catch (error) {
                commit(
                    "setActivitiesError",
                    (error && error.user_message) || "Une erreur est survenue"
                );
            }

            commit("setActivitiesLoading", false);
        }
    },

    getters: {
        activitiesLoading(state) {
            return state.loading;
        },
        activitiesError(state) {
            return state.error;
        },
        activities(state) {
            return state.items;
        },
        lastActivityDate(state) {
            return state.lastActivityDate;
        },
        endOfActivities(state) {
            return state.endOfActivities;
        },
        activitiesFilters(state) {
            return state.filters.activityTypes;
        },
        activitiesLoadedLocationType(state) {
            return state.loaded.locationType;
        },
        activitiesLoadedLocationCode(state) {
            return state.loaded.locationCode;
        },
        activitiesLoadedFilters(state) {
            return state.loaded.filters;
        }
    }
};
