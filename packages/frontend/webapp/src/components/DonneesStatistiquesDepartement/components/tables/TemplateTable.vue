<template>
    <div class="h-screen overflow-y-auto">
        <table class="w-full data-table table-fixed leading-5 max-h-full">
            <thead>
                <HeaderRow :columns="columns" class="sticky top-0" />
            </thead>

            <tbody>
                <CitySubTable
                    v-for="data in metrics.cities"
                    :key="data.city.code"
                    :data="data"
                    :columns="columns"
                    :showTowns="
                        departementMetricsStore.collapsedCities[
                            data.city.code
                        ] !== false
                    "
                    :highlightedTown="highlightedTown"
                    @highlightTown="onHighlight"
                    @unhighlightTown="onUnhighlight"
                    @townClick="onTownClick"
                    @townZoom="onTownZoom"
                />

                <TotalRow :columns="columns" :metrics="metrics" />
            </tbody>
        </table>
    </div>
</template>

<style lang="scss">
.data-table thead th,
.data-table tbody th,
.data-table tbody td {
    @apply px-2;
}

.data-table tbody th,
.data-table tbody td {
    @apply border-y border-G400;
}

.data-table tbody th:not(:last-child),
.data-table tbody td:not(:last-child) {
    @apply border-r;
}

.data-table thead th:not(:last-child) {
    @apply border-r;
}

.data-table-header {
    @apply bg-blue200;

    th:not(:last-child) {
        @apply border-x-blue300;
    }
}
</style>

<script setup>
import { toRefs } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";

import CitySubTable from "./CitySubTable.vue";
import HeaderRow from "../rows/HeaderRow.vue";
import TotalRow from "../rows/TotalRow.vue";

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    metrics: {
        type: Array,
        required: true,
    },
    highlightedTown: {
        type: Number,
        required: false,
    },
});
const { columns, metrics, highlightedTown } = toRefs(props);
const departementMetricsStore = useDepartementMetricsStore();
const emit = defineEmits([
    "highlightTown",
    "townClick",
    "townZoom",
    "unhighlightTown",
]);

function onHighlight(...args) {
    emit("highlightTown", ...args);
}

function onUnhighlight(...args) {
    emit("unhighlightTown", ...args);
}

function onTownClick(...args) {
    emit("townClick", ...args);
}

function onTownZoom(...args) {
    emit("townZoom", ...args);
}
</script>
