<template>
    <IndicateursTableRowInputs :icon="icons.sante" :inputs="healthInputs">
        <IndicateursLabelSante />
    </IndicateursTableRowInputs>
</template>

<script setup>
import icons from "@/utils/action_metrics_icons";

import IndicateursTableRowInputs from "@/components/IndicateursTable/IndicateursTableRowInputs.vue";
import IndicateursLabelSante from "@/components/IndicateursLabel/IndicateursLabelSante.vue";

const healthInputs = [
    { name: "sante_nombre_personnes", tableLabel: "Personnes" },
];
</script>
