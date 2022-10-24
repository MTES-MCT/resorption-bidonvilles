import getRandomString from "#src/js/utils/getRandomString";

export default {
    namespaced: true,

    state: {
        items: []
    },

    mutations: {
        ADD_ITEM(state, item) {
            state.items.push(item);
        },
        REMOVE_ITEM(state, itemIndex) {
            state.items.splice(itemIndex, 1);
        }
    },

    actions: {
        add({ commit }, { text, icon }) {
            commit("ADD_ITEM", {
                id: getRandomString(),
                text,
                icon
            });
        },
        remove({ state, commit }, itemId) {
            const index = state.items.findIndex(({ id }) => id === itemId);
            if (index === -1) {
                return;
            }

            commit("REMOVE_ITEM", index);
        }
    }
};
