<template>
    <IndicateursTableRowInputs :icon="icons.personnes" :inputs="inputs">
        <IndicateursLabelPersonnes />
    </IndicateursTableRowInputs>
</template>

<script setup>
import icons from "@/utils/action_metrics_icons";

import IndicateursTableRowInputs from "@/components/IndicateursTable/IndicateursTableRowInputs.vue";
import IndicateursLabelPersonnes from "@/components/IndicateursLabel/IndicateursLabelPersonnes.vue";

const inputs = [
    { name: "nombre_personnes", tableLabel: "Personnes" },
    { name: "nombre_menages", tableLabel: "Ménages" },
    { name: "nombre_femmes", tableLabel: "Femmes" },
    { name: "nombre_mineurs", tableLabel: "Mineurs" },
];
</script>
