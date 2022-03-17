import { list } from "#helpers/api/plan";

export default {
    state: {
        state: null,
        error: null,
        currentPage: 1,
        topicFilter: [],
        locationFilter: null,
        items: [],
    },

    mutations: {
        setPlansState(state, s) {
            state.state = s;
        },
        setPlansError(state, error) {
            state.error = error;
        },
        setPlansPage(state, page) {
            state.currentPage = page;
        },
        setPlansItems(state, items) {
            state.items = items;
        },
        setPlansLocationFilter(state, filter) {
            state.currentPage = 1;
            state.locationFilter = filter;
        },
        setTopicFilter(state, filter) {
            state.currentPage = 1;
            state.topicFilter = filter;
        },
        addPlan(state, plan) {
            const index = state.items.findIndex((item) => item.id === plan.id);
            if (index === -1) {
                state.items.push(plan);
            } else {
                state.items.splice(index, 1, plan);
            }
        },
    },

    actions: {
        async fetchPlans({ state, commit, rootState }) {
            if (state.state === "loading") {
                return;
            }

            commit("setPlansState", "loading");
            commit("setPlansError", null);
            commit("setPlansItems", []);
            commit("setPlansPage", 1);

            try {
                // initialize location filter
                commit(
                    "setPlansLocationFilter",
                    getUserDefaultLocation(rootState)
                );

                // actually fetch data
                const plans = await list();
                commit("setPlansItems", plans);
                commit("setPlansState", "loaded");
            } catch (error) {
                commit(
                    "setPlansError",
                    (error && error.user_message) ||
                        "Une erreur inconnue est survenue"
                );
                commit("setPlansState", "error");
            }
        },
    },

    getters: {
        plansState(state) {
            return state.state;
        },
        plansError(state) {
            return state.error;
        },
        plansCurrentPage(state) {
            return state.currentPage;
        },
        plansItems(state, getters) {
            let searchReg;
            if (!getters.plansLocationFilter.data) {
                const { label: search } = getters.plansLocationFilter;
                searchReg = new RegExp(search, "ig");
            }

            return state.items.filter((plan) => {
                // keep open plans only
                if (plan.closed_at !== null) {
                    return false;
                }

                // geographic filter
                if (getters.plansLocationFilter.data.type !== "nation") {
                    const l = plan[getters.plansLocationFilter.data.type];
                    if (
                        !l ||
                        l.code !== `${getters.plansLocationFilter.data.code}`
                    ) {
                        return false;
                    }
                }

                // topic filter
                if (state.topicFilter.length > 0) {
                    if (
                        !plan.topics.some(({ uid }) =>
                            state.topicFilter.includes(uid)
                        )
                    ) {
                        return false;
                    }
                }

                // recherche textuelle
                if (searchReg && !!plan.name?.match(searchReg)) {
                    return false;
                }

                return true;
            });
        },
        plansLocationFilter(state) {
            return state.locationFilter && state.locationFilter.label
                ? state.locationFilter
                : {
                      id: null,
                      label: "France",
                      category: "Pays",
                      data: {
                          code: null,
                          type: "nation",
                      },
                  };
        },
    },
};

function getUserDefaultLocation(rootState) {
    const { user } = rootState.config.configuration;

    let userLocationType = user.organization.location.type;
    if (userLocationType === "epci" || userLocationType === "city") {
        userLocationType = "departement";
    }

    return {
        id:
            userLocationType === "nation"
                ? null
                : user.organization.location[userLocationType].code,
        label:
            userLocationType === "nation"
                ? "France"
                : user.organization.location[userLocationType].name,
        category: userLocationType,
        data: {
            code:
                userLocationType === "nation"
                    ? null
                    : user.organization.location[userLocationType].code,
            type: userLocationType,
        },
    };
}
