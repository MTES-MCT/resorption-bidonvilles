<template>
    <EvolutionChartInhabitants />
    <EvolutionChartTowns class="mt-6" />
    <EvolutionChartLivingCondition
        class="mt-6"
        chartLabel="Sites avec accès à l'eau"
        :data="data.water"
        chartType="towns"
        icon="faucet-drip"
        livingConditionType="towns_with_access_to_water"
        ><template v-slot:title> Accès à l'eau </template>
    </EvolutionChartLivingCondition>
</template>

<script setup>
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";

import EvolutionChartInhabitants from "../charts/EvolutionChartInhabitants.vue";
import EvolutionChartTowns from "../charts/EvolutionChartTowns.vue";
import EvolutionChartLivingCondition from "../charts/EvolutionChartLivingCondition.vue";

const departementMetricsStore = useDepartementMetricsStore();
const data = departementMetricsStore.evolution.data.livingConditions;
</script>
