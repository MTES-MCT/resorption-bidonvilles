<template>
    <EvolutionChartLivingCondition
        class="mt-6"
        chartLabel="Nombre de sites avec accès à l'eau"
        :data="data.water"
        chartType="towns"
        livingConditionType="towns_with_access_to_water"
        ><template v-slot:title> Accès à l'eau </template>
    </EvolutionChartLivingCondition>

    <EvolutionChartLivingCondition
        class="mt-6"
        chartLabel="Nombre de sites avec accès à l'électricité"
        :data="data.electricity"
        chartType="towns"
        livingConditionType="towns_with_access_to_electricity"
        ><template v-slot:title> Accès à l'électricité </template>
    </EvolutionChartLivingCondition>

    <EvolutionChartLivingCondition
        class="mt-6"
        chartLabel="Nombre de sites avec accès à des toilettes"
        :data="data.toilets"
        chartType="towns"
        livingConditionType="towns_with_access_to_toilets"
        ><template v-slot:title> Accès à des toilettes </template>
    </EvolutionChartLivingCondition>

    <EvolutionChartLivingCondition
        class="mt-6"
        chartLabel="Nombre de sites avec accès à une évacuation des déchets"
        :data="data.trash_evacuation"
        chartType="towns"
        livingConditionType="towns_with_access_to_trash_evacuation"
        ><template v-slot:title> Accès à une évacuation des déchets </template>
    </EvolutionChartLivingCondition>

    <EvolutionChartLivingCondition
        class="mt-6"
        chartLabel="Nombre de sites avec accès à une prévention incendie"
        :data="data.fire_prevention"
        chartType="towns"
        livingConditionType="towns_with_access_to_fire_prevention"
        ><template v-slot:title> Accès à une prévention incendie </template>
    </EvolutionChartLivingCondition>

    <EvolutionChartLivingCondition
        class="mt-6"
        chartLabel="Nombre de sites sur un site sans nuisibles"
        :data="data.pest_animals"
        chartType="towns"
        livingConditionType="towns_with_absence_of_pest_animals"
        ><template v-slot:title> Absence de nuisibles</template>
    </EvolutionChartLivingCondition>
</template>

<script setup>
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import EvolutionChartLivingCondition from "../charts/EvolutionChartLivingCondition.vue";

const departementMetricsStore = useDepartementMetricsStore();
const data = departementMetricsStore.evolution.data.livingConditions;
</script>
