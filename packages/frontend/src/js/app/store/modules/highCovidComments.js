import {
    getDepartementsForRegion,
    getDepartementsForEpci
} from "#helpers/api/geo";

export default {
    state: {
        isFetched: false,
        allowedDepartements: []
    },

    mutations: {
        reset(state) {
            state.isFetched = false;
            state.allowedDepartements = [];
        },
        setAllowedDepartements(state, departements) {
            state.isFetched = true;
            state.allowedDepartements = departements;
        }
    },

    actions: {
        async fetchAllowedDepartements({ commit, state, rootState }) {
            if (state.isFetched === true) {
                return;
            }

            const { user } = rootState.config.configuration;

            switch (user.organization.location.type) {
                case "region":
                    commit(
                        "setAllowedDepartements",
                        (
                            await getDepartementsForRegion(
                                user.organization.location.region.code
                            )
                        ).departements
                    );
                    break;

                case "epci":
                    commit(
                        "setAllowedDepartements",
                        (
                            await getDepartementsForEpci(
                                user.organization.location.epci.code
                            )
                        ).departements
                    );
                    break;

                case "departement":
                case "city":
                    commit("setAllowedDepartements", [
                        user.organization.location.departement
                    ]);
                    break;

                case "nation":
                default:
                    commit("setAllowedDepartements", []);
            }
        }
    },

    getters: {
        allowedDepartements(state) {
            return state.allowedDepartements;
        }
    }
};
