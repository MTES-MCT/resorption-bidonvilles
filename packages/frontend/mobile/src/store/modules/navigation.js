export default {
    namespaced: true,

    state: {
        notesTab: "/liste-des-notes"
    },

    mutations: {
        SET_TAB(state, { tab, page }) {
            state[`${tab}Tab`] = page;
        }
    }
};
