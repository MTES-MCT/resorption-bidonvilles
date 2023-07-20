<template>
    <EvolutionChartLivingCondition
        class="mt-6"
        chartLabel="Personnes avec accès à l'eau"
        :data="data.water"
        livingConditionType="inhabitants_with_access_to_water"
        chartType="inhabitants"
        icon="faucet-drip"
        ><template v-slot:title> Accès à l'eau </template>
    </EvolutionChartLivingCondition>

    <EvolutionChartLivingCondition
        class="mt-6"
        chartLabel="Personnes avec accès à l'électricité"
        :data="data.electricity"
        chartType="inhabitants"
        livingConditionType="inhabitants_with_access_to_electricity"
        icon="bolt"
        ><template v-slot:title> Accès à l'électricité </template>
    </EvolutionChartLivingCondition>

    <EvolutionChartLivingCondition
        class="mt-6"
        chartLabel="Personnes avec accès à des toilettes"
        :data="data.toilets"
        chartType="inhabitants"
        livingConditionType="inhabitants_with_access_to_toilets"
        icon="toilet"
        ><template v-slot:title> Accès à des toilettes </template>
    </EvolutionChartLivingCondition>

    <EvolutionChartLivingCondition
        class="mt-6"
        chartLabel="Personnes avec accès à une évacuation des déchets"
        :data="data.trash_evacuation"
        chartType="inhabitants"
        livingConditionType="inhabitants_with_access_to_trash_evacuation"
        icon="trash-alt"
        ><template v-slot:title> Accès à une évacuation des déchets </template>
    </EvolutionChartLivingCondition>

    <EvolutionChartLivingCondition
        class="mt-6"
        chartLabel="Personnes avec accès à une prévention incendie"
        :data="data.fire_prevention"
        chartType="inhabitants"
        livingConditionType="inhabitants_with_access_to_fire_prevention"
        icon="fire-extinguisher"
        ><template v-slot:title> Accès à une prévention incendie </template>
    </EvolutionChartLivingCondition>

    <EvolutionChartLivingCondition
        class="mt-6"
        chartLabel="Personnes sur un site sans nuisibles"
        :data="data.pest_animals"
        chartType="inhabitants"
        livingConditionType="inhabitants_with_absence_of_pest_animals"
        icon="mouse-field"
        ><template v-slot:title> Absence de nuisibles</template>
    </EvolutionChartLivingCondition>
</template>

<script setup>
import { useDepartementMetricsStore } from "@/stores/metrics.departement.store";
import EvolutionChartLivingCondition from "../charts/EvolutionChartLivingCondition.vue";

const departementMetricsStore = useDepartementMetricsStore();
const data = departementMetricsStore.evolution.data.livingConditions;
</script>
