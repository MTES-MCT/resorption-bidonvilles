export default {
    namespaced: true,

    state: {
        sitesTab: "/liste-des-sites",
        notesTab: "/liste-des-notes"
    },

    mutations: {
        SET_TAB(state, { tab, page }) {
            state[`${tab}Tab`] = page;
        }
    }
};
