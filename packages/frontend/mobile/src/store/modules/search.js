export default {
    namespaced: true,

    state: {
        listener: null,
        search: "",
        request: null,
        results: null,
        error: null
    },

    mutations: {
        SET_LISTENER(state, listener) {
            state.listener = listener;
        },
        SET_SEARCH(state, search) {
            state.search = search;
        },
        SET_REQUEST(state, request) {
            state.request = request;
        },
        SET_RESULTS(state, results) {
            state.results = results;
        },
        SET_ERROR(state, error) {
            state.error = error;
        }
    }
};
