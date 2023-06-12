<template>
    <table class="w-full data-table table-fixed leading-5">
        <thead>
            <HeaderRow :columns="columns" />
        </thead>

        <tbody>
            <CitySubTable
                v-for="city in enrichedMetrics"
                :key="city.code"
                :data="city"
                :columns="columns"
            />

            <TotalRow :columns="columns" />
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
import { computed, toRefs } from "vue";

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

const enrichedMetrics = computed(() => {
    const base = columns.value.reduce(
        (acc, { uid, default: defaultValue }) => ({
            ...acc,
            [uid]: defaultValue,
        }),
        {}
    );
    const [primaryFns, secondaryFns] = columns.value.reduce(
        (acc, { primaryMetric, secondaryMetric }) => {
            if (primaryMetric) {
                acc[0].push(primaryMetric);
            }
            if (secondaryMetric) {
                acc[1].push(secondaryMetric);
            }

            return acc;
        },
        [[], []]
    );

    return metrics.value.cities.map((city) => {
        const m = {
            ...city,
            summary: city.towns.reduce(
                (acc, town) => {
                    primaryFns.forEach((fn) => fn(acc, town, city));
                    return acc;
                },
                { ...base }
            ),
        };

        secondaryFns.forEach((fn) => fn(m.summary, city));
        return m;
    });
});
</script>
