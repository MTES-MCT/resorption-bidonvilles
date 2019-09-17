import { open } from '#helpers/tabHelper';

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
            open(routeData.href);
        },
    },
};
