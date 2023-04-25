<template>
    <IndicateursTableRowInputs
        :icon="icons.hebergement"
        :data="data"
        :inputs="hebergementInputs"
    >
        <IndicateursLabelHebergement />
    </IndicateursTableRowInputs>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import icons from "@/utils/action_metrics_icons";
import sections from "./sections.list";

import IndicateursTableRowInputs from "@/components/IndicateursTable/IndicateursTableRowInputs.vue";
import IndicateursLabelHebergement from "@/components/IndicateursLabel/IndicateursLabelHebergement.vue";

const hebergementInputs = computed(() => {
    return sections.find(({ id }) => id === "hebergement").inputs;
});
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});
const { data } = toRefs(props);
</script>
