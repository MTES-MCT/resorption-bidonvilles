<template>
    <div>
        <Pagination
            :currentPage="currentPage"
            :nbPages="nbPages"
            :onChangePage="onChangePage"
        />
    </div>
</template>

<script>
import store from "#app/store";

export default {
    computed: {
        nbPages() {
            return Math.ceil(
                store.getters.activitiesFilteredItems.length /
                    store.state.activities.itemsPerPage
            );
        },
        currentPage() {
            return store.state.activities.currentPage;
        }
    },
    methods: {
        onChangePage(page) {
            store.commit("setActivitiesPage", page);
            this.$emit("change");
        }
    }
};
</script>
