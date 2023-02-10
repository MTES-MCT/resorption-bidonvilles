<template>
    <IndicateursTableRowInputs :icon="icons.travail" :inputs="workInputs">
        <IndicateursLabelTravail />
    </IndicateursTableRowInputs>
</template>

<script setup>
import icons from "@/utils/action_metrics_icons";

import IndicateursTableRowInputs from "@/components/IndicateursTable/IndicateursTableRowInputs.vue";
import IndicateursLabelTravail from "@/components/IndicateursLabel/IndicateursLabelTravail.vue";

const workInputs = [
    { name: "travail_nombre_personnes", tableLabel: "Personnes" },
    { name: "travail_nombre_femmes", tableLabel: "Femmes" },
];
</script>
