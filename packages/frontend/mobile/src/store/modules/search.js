export default {
    namespaced: true,

    state: {
        listener: null
    },

    mutations: {
        SET_LISTENER(state, listener) {
            state.listener = listener;
        }
    }
};
