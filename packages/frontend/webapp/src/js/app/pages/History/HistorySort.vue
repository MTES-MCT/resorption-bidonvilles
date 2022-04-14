<template>
    <div>Trier par<br /><Sort :options="options" v-model="sort" /></div>
</template>

<script>
export default {
    data() {
        return {
            options: [{ id: 0, label: "Date", value: "date" }]
        };
    },

    computed: {
        sort: {
            get() {
                return this.$store.state.activities.sort;
            },
            set(value) {
                this.$store.commit("setActivitiesSort", value);
            }
        }
    }
};
</script>
