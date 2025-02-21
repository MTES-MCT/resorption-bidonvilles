<template>
    <div
        class="mt-12 text-center text-3xl text-primary"
        v-if="departementMetricsStore.evolution.isLoading"
    >
        <Spinner />
    </div>
    <ViewErrorInline
        class="mt-12"
        v-else-if="departementMetricsStore.evolution.error"
    >
        <template v-slot:title
            >Les données d'évolution n'ont pas pu être chargées</template
        >
        <template v-slot:code>{{
            departementMetricsStore.evolution.error
        }}</template>
    </ViewErrorInline>
    <div class="mt-6" v-else>
        <component :is="currentTabComponent" />
    </div>
</template>

<script setup>
import { computed } from "vue";

import ViewErrorInline from "@/components/ViewErrorInline/ViewErrorInline.vue";
import EvolutionChartTabSummary from "./EvolutionChartTabSummary.vue";
import EvolutionChartTabInhabitants from "./EvolutionChartTabInhabitants.vue";
import EvolutionChartTabLivingConditionsByInhabitant from "./EvolutionChartTabLivingConditionsByInhabitant.vue";
import EvolutionChartTabLivingConditionsByTown from "./EvolutionChartTabLivingConditionsByTown.vue";
import EvolutionChartSchooling from "../charts/EvolutionChartSchooling.vue";
import EvolutionChartTabJustice from "./EvolutionChartTabJustice.vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";

const departementMetricsStore = useDepartementMetricsStore();
const tabs = {
    summary: EvolutionChartTabSummary,
    inhabitants: EvolutionChartTabInhabitants,
    livingConditionsByInhabitant: EvolutionChartTabLivingConditionsByInhabitant,
    livingConditionsByTown: EvolutionChartTabLivingConditionsByTown,
    schooling: EvolutionChartSchooling,
    justice: EvolutionChartTabJustice,
};

const currentTabComponent = computed(() => {
    return tabs[departementMetricsStore.activeTab];
});
</script>
