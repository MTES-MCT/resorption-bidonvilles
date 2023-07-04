<template>
    <tr
        class="text-right data-table-header hover:bg-blue300 cursor-pointer"
        @click="toggleCollapse"
    >
        <th><Icon :icon="collapseIcon" /></th>
        <th class="text-left font-normal py-1">
            <CommuneHeadCell :data="data" />
        </th>
        <th
            class="font-normal align-top max-w-4 py-1"
            v-for="col in columns"
            :key="col.uid"
        >
            <component :is="col.headComponent" :data="data" />
        </th>
        <th></th>
    </tr>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import { Icon } from "@resorptionbidonvilles/ui";
import CommuneHeadCell from "../cells/Commune/CommuneHead.vue";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    columns: {
        type: Array,
        required: true,
    },
});
const { data, columns } = toRefs(props);

const departementMetricsStore = useDepartementMetricsStore();
function toggleCollapse() {
    if (
        departementMetricsStore.collapsedCities[data.value.city.code] ===
        undefined
    ) {
        departementMetricsStore.collapsedCities[data.value.city.code] = false;
    } else {
        departementMetricsStore.collapsedCities[data.value.city.code] =
            !departementMetricsStore.collapsedCities[data.value.city.code];
    }
}

const collapseIcon = computed(() => {
    return departementMetricsStore.collapsedCities[data.value.city.code] !==
        false
        ? "chevron-down"
        : "chevron-right";
});
</script>
