<template>
    <IndicateursTableRowInputs
        :icon="icons.hebergement"
        :inputs="hebergementInputs"
    >
        <IndicateursLabelHebergement />
    </IndicateursTableRowInputs>
</template>

<script setup>
import icons from "@/utils/action_metrics_icons";

import IndicateursTableRowInputs from "@/components/IndicateursTable/IndicateursTableRowInputs.vue";
import IndicateursLabelHebergement from "@/components/IndicateursLabel/IndicateursLabelHebergement.vue";

const hebergementInputs = [
    { name: "hebergement_nombre_personnes", tableLabel: "Personnes" },
    { name: "hebergement_nombre_menages", tableLabel: "Ménages" },
];
</script>
