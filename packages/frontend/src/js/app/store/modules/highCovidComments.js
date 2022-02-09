import {
    getDepartementsForRegion,
    getDepartementsForEpci
} from "#helpers/api/geo";
import { get as getConfig } from "#helpers/api/config";

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
        async fetchAllowedDepartements({ commit, state }) {
            if (state.isFetched === true) {
                return;
            }

            const { user } = getConfig();

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
