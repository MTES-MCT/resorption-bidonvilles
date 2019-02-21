export default {
    props: {
        towns: Array,
    },
    methods: {
        formatDate(ts) {
            return App.formatDate(ts);
        },
        showTown(id) {
            this.$router.push(`/site/${id}`);
        },
    },
};
