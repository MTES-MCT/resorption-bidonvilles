<template>
    <header class="flex flex-col xl:flex-row lg:space-x-4 justify-between">
        <div class="flex space-x-4 items-end">
            <div>
                <p>Du</p>
                <DatepickerInput withoutMargin />
            </div>

            <div>
                <p>Au</p>
                <DatepickerInput withoutMargin />
            </div>

            <Button>Valider</Button>
        </div>
        <div class="hidden xl:block">
            <p>&nbsp;</p>
            <p class="flex space-x-4 items-center">
                <Button variant="primaryOutline">L'année dernière</Button>
                <Button variant="primaryOutline">Le mois dernier</Button>
                <Button variant="primaryOutline">La semaine dernière</Button>
            </p>
        </div>
    </header>

    <div class="mt-6">
        <component :is="currentTabComponent" />
    </div>
</template>

<script setup>
import { Button, DatepickerInput } from "@resorptionbidonvilles/ui";
import EvolutionChartTabSummary from "./EvolutionChartTabSummary.vue";
import EvolutionChartTabInhabitants from "./EvolutionChartTabInhabitants.vue";
import EvolutionChartTabLivingConditions from "./EvolutionChartTabLivingConditions.vue";
import EvolutionChartTabJustice from "./EvolutionChartTabJustice.vue";
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import { computed } from "vue";

const departementMetricsStore = useDepartementMetricsStore();
const tabs = {
    summary: EvolutionChartTabSummary,
    inhabitants: EvolutionChartTabInhabitants,
    livingConditions: EvolutionChartTabLivingConditions,
    justice: EvolutionChartTabJustice,
};

const currentTabComponent = computed(() => {
    return tabs[departementMetricsStore.activeTab];
});
</script>
