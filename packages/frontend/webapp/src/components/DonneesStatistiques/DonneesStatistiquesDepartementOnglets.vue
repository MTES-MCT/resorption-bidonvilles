<template>
    <div class="pt-4 px-4 mb-6 border-b-1 border-b-g300">
        <Tab
            @click="switchTab(tab.id)"
            v-for="tab in tabs"
            :key="tab.id"
            :id="tab.id"
            :active="tab.id === departementMetricsStore.activeTab"
        >
            {{ tab.label }}</Tab
        >
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import { trackEvent } from "@/helpers/matomo";

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
    trackEvent(
        "Visualisation des données départementales",
        "Changement d'onglet",
        value
    );
    departementMetricsStore.activeTab = value;
}
</script>
