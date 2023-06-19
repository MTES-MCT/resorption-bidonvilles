<template>
    <div class="bg-blue100 pt-4 px-6">
        <Tab
            @click="switchTab(tab.id)"
            v-for="tab in tabs"
            :key="tab.id"
            :active="tab.id === departementMetricsStore.activeTab"
        >
            {{ tab.label }}</Tab
        >
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";

import Tab from "./Tab.vue";

const props = defineProps({
    tabs: {
        type: Array,
        required: true,
    },
});

const { tabs } = toRefs(props);

const departementMetricsStore = useDepartementMetricsStore();

function switchTab(value) {
    departementMetricsStore.activeTab = value;
}
</script>
