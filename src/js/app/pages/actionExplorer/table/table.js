export default {
    props: {
        actions: Array,
    },
    methods: {
        showAction(id) {
            this.$router.push(`/action/${id}`);
        },
    },
};
