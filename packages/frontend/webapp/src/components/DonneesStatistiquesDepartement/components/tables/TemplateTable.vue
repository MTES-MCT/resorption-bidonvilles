<template>
    <table class="w-full data-table table-fixed leading-5">
        <thead>
            <HeaderRow :columns="columns" class="sticky top-0" />
        </thead>

        <tbody>
            <CitySubTable
                v-for="city in metrics.cities"
                :key="city.code"
                :data="city"
                :columns="columns"
                @highlightTown="onHighlight"
                @unhighlightTown="onUnhighlight"
                @townClick="onTownClick"
                @townZoom="onTownZoom"
            />

            <TotalRow :columns="columns" :metrics="metrics" />
        </tbody>
    </table>
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
});
const { columns, metrics } = toRefs(props);
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
