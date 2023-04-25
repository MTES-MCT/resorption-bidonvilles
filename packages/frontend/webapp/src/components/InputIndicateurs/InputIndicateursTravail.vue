<template>
    <IndicateursTableRowInputs
        :icon="icons.travail"
        :data="data"
        :inputs="workInputs"
    >
        <IndicateursLabelTravail />
    </IndicateursTableRowInputs>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import icons from "@/utils/action_metrics_icons";
import sections from "./sections.list";

import IndicateursTableRowInputs from "@/components/IndicateursTable/IndicateursTableRowInputs.vue";
import IndicateursLabelTravail from "@/components/IndicateursLabel/IndicateursLabelTravail.vue";

const workInputs = computed(() => {
    return sections.find(({ id }) => id === "travail").inputs;
});
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});
const { data } = toRefs(props);
</script>
