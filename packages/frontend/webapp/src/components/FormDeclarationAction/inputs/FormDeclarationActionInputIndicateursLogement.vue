<template>
    <IndicateursTableRowInputs :inputs="logementInputs" withoutTopBorder>
        <IndicateursLabelLogement />
    </IndicateursTableRowInputs>
</template>

<script setup>
import IndicateursTableRowInputs from "@/components/IndicateursTable/IndicateursTableRowInputs.vue";
import IndicateursLabelLogement from "@/components/IndicateursLabel/IndicateursLabelLogement.vue";

const logementInputs = [
    { name: "logement_nombre_personnes", tableLabel: "Personnes" },
    { name: "logement_nombre_menages", tableLabel: "Ménages" },
];
</script>
