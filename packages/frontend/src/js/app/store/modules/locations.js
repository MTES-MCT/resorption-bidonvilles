const { get } = require("#helpers/api/geo");

export default {
    state: {
        locations: {}
    },

    mutations: {
        saveLocation(state, value) {
            const { type, code } = value.data;
            if (!state.locations[type]) {
                state.locations[type] = {};
            }

            state.locations[type][code] = value;
        }
    },

    actions: {
        async fetchLocation({ commit }, { type, code }) {
            const location = await get(type, code);
            const { name } = location[type];

            commit("saveLocation", {
                id: code,
                label: name,
                category: type,
                locationType: type,
                code: code,
                data: {
                    code,
                    type
                }
            });
        }
    },

    getters: {
        locations(state) {
            return state.locations;
        }
    }
};
