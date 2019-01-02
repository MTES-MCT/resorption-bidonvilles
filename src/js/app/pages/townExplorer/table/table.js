export default {
    props: {
        towns: Array,
    },
    methods: {
        showTown(id) {
            this.$router.push(`/site/${id}`);
        },
    },
};
