export default {
    namespaced: true,

    state: {
        mobileMenuIsOpen: false
    },

    mutations: {
        openMobileMenu(state) {
            state.mobileMenuIsOpen ^= true;
        },
        closeMobileMenu(state) {
            state.mobileMenuIsOpen = false;
        }
    }
};
