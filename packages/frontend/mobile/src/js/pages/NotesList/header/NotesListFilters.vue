<template>
    <div class="bg-G300 mt-3 overflow-hidden filters" ref="container">
        <div class="flex justify-between text-center text-sm">
            <div
                class="flex-1 py-2"
                v-for="filter in filters"
                v-bind:class="{
                    'bg-primary text-white': filter.key === currentFilter
                }"
                :key="filter.key"
                @click="setFilter(filter.key)"
            >
                {{ filter.label }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.filters {
    transition: height 0.5s 0s ease-in-out;
}
</style>

<script>
export default {
    data() {
        return {
            filters: [
                { key: "all", label: "Toutes" },
                { key: "unpublished", label: "Non publiées" },
                { key: "published", label: "Publiées" }
            ]
        };
    },

    computed: {
        currentFilter() {
            return this.$store.state.notes.filter;
        }
    },

    methods: {
        show() {
            this.$refs.container.style.height = `${this.$refs.container.firstChild.offsetHeight}px`;
        },
        hide() {
            this.$refs.container.style.height = "0";
        },
        setFilter(filter) {
            this.$store.commit("notes/SET_FILTER", filter);
        }
    }
};
</script>
