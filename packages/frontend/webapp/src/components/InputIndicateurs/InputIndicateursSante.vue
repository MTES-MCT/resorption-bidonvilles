<template>
    <IndicateursTableRowInputs
        :icon="icons.sante"
        :data="data"
        :inputs="healthInputs"
    >
        <IndicateursLabelSante />
    </IndicateursTableRowInputs>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import icons from "@/utils/action_metrics_icons";
import sections from "./sections.list";

import IndicateursTableRowInputs from "@/components/IndicateursTable/IndicateursTableRowInputs.vue";
import IndicateursLabelSante from "@/components/IndicateursLabel/IndicateursLabelSante.vue";

const healthInputs = computed(() => {
    return sections.find(({ id }) => id === "sante").inputs;
});
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});
const { data } = toRefs(props);
</script>
