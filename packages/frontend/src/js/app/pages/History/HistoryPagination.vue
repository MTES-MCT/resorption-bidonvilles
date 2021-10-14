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
export default {
    computed: {
        nbPages() {
            return Math.ceil(
                this.$store.getters.activitiesFilteredItems.length /
                    this.$store.state.activities.itemsPerPage
            );
        },
        currentPage() {
            return this.$store.state.activities.currentPage;
        }
    },
    methods: {
        onChangePage(page) {
            this.$store.commit("setActivitiesPage", page);
            this.$emit("change");
        }
    }
};
</script>
