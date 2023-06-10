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
            class="mt-4"
            v-if="metricsStore.nationStatus === 'loaded'"
        />
    </header>
</template>

<script setup>
import { useMetricsStore } from "@/stores/metrics.store";
import Actions from "./Actions.vue";
import Dates from "./Dates.vue";
import Parametres from "./Parametres.vue";

const metricsStore = useMetricsStore();
</script>
