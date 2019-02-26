export default {
    props: {
        towns: Array,
    },
    methods: {
        formatDate(ts) {
            return App.formatDate(ts);
        },
        showTown(id) {
            const routeData = this.$router.resolve(`/site/${id}`);
            window.open(routeData.href, '_blank');
        },
    },
};
