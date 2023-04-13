<template>
    <IndicateursTableRowInputs
        :icon="icons.personnes"
        :data="data"
        :inputs="inputs"
        :errors="errors"
    >
        <IndicateursLabelPersonnes />
    </IndicateursTableRowInputs>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import icons from "@/utils/action_metrics_icons";

import IndicateursTableRowInputs from "@/components/IndicateursTable/IndicateursTableRowInputs.vue";
import IndicateursLabelPersonnes from "@/components/IndicateursLabel/IndicateursLabelPersonnes.vue";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    errors: {
        type: Object,
        required: false,
        default() {
            return {};
        },
    },
});
const { data, errors } = toRefs(props);

const inputs = [
    {
        id: "nombre_personnes",
        tableLabel: "Personnes",
    },
    {
        id: "nombre_femmes",
        tableLabel: "... dont femmes",
    },
    {
        id: "nombre_mineurs",
        tableLabel: "... dont mineurs",
    },
    {
        id: "nombre_menages",
        tableLabel: "Ménages",
    },
];
</script>
