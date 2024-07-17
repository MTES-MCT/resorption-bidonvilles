<template>
    <header>
        <div
            class="flex flex-col items-start lg:flex-row lg:justify-between lg:items-end"
        >
            <Dates />
            <Actions
                class="mt-2 mb-4 lg:mt-0 lg:mb-0"
                v-if="metricsStore.nationStatus === 'loaded'"
            />
        </div>

        <Parametres
            class="overflow-hidden relative"
            v-if="
                metricsStore.nationStatus === 'loaded' &&
                departementMetricsStore.activeTab === 'tableau'
            "
            :class="metricsStore.showParametres ? 'h-auto mt-4' : 'h-0'"
        />
    </header>
</template>

<script>
export default {
    name: "RbHeader",
};
</script>

<script setup>
import { useMetricsStore } from "@/stores/metrics.store";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import Actions from "./Actions.vue";
import Dates from "./Dates.vue";
import Parametres from "./Parametres.vue";

const metricsStore = useMetricsStore();
const departementMetricsStore = useDepartementMetricsStore();
</script>
