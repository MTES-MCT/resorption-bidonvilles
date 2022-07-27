export default {
    namespaced: true,

    state: {
        showOldLivingConditions: false
    },

    mutations: {
        SET_SHOW_OLD_LIVING_CONDITIONS(state, value) {
            state.showOldLivingConditions = value;
        }
    }
};
