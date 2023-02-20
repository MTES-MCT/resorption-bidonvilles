<template>
    <div
        class="whitespace-nowrap overflow-y-auto flex pt-2 pb-4 bg-G300 border-b-2 border-G400"
    >
        <div
            class="px-3 text-primary"
            v-for="filter in filters"
            :key="filter.id"
            @click="changeFilter(filter.id)"
        >
            <span
                :class="
                    filter.id === selectedFilter
                        ? 'bg-primary text-white rounded px-2 py-1'
                        : ''
                "
                >{{ filter.label }}</span
            >
        </div>
    </div>
</template>

<script>
import filters from "./TownsSearch.filter";

export default {
    data() {
        return {
            filters,
        };
    },
    props: {
        selectedFilter: String,
    },
    methods: {
        changeFilter(id) {
            this.$emit("changeFilter", id);
        },
    },
};
</script>
