export default {
    namespaced: true,

    state: {
        notesTab: "/notes"
    },

    mutations: {
        SET_TAB(state, { tab, page }) {
            state[`${tab}Tab`] = page;
        }
    }
};
