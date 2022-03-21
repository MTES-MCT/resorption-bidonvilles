import { list } from "#helpers/api/plan";

export default {
    state: {
        state: null,
        error: null,
        currentPage: 1,
        locationFilter: null,
        items: []
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
        addPlan(state, plan) {
            const index = state.items.findIndex(item => item.id === plan.id);
            if (index === -1) {
                state.items.push(plan);
            } else {
                state.items.splice(index, 1, plan);
            }
        }
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
        }
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
            const openPlans = state.items.filter(
                ({ closed_at: closedAt }) => closedAt === null
            );
            if (getters.plansLocationFilter.data.type === "nation") {
                return openPlans;
            }

            return openPlans.filter(plan => {
                const l = plan[getters.plansLocationFilter.data.type];
                return (
                    l && l.code === `${getters.plansLocationFilter.data.code}`
                );
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
                          type: "nation"
                      }
                  };
        }
    }
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
            type: userLocationType
        }
    };
}
