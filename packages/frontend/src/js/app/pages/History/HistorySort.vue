<template>
    <div>Trier par<br /><Sort :options="options" v-model="sort" /></div>
</template>

<script>
import store from "#app/store";

export default {
    data() {
        return {
            options: [{ id: 0, label: "Date", value: "date" }]
        };
    },

    computed: {
        sort: {
            get() {
                return store.state.activities.sort;
            },
            set(value) {
                store.commit("setActivitiesSort", value);
            }
        }
    }
};
</script>
