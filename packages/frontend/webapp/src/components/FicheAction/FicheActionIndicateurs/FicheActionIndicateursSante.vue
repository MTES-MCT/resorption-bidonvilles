<template>
    <IndicateursTableRowData
        :icon="icons.sante"
        :labels="['Personnes']"
        :data="data"
    >
        <IndicateursLabelSante />
    </IndicateursTableRowData>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import icons from "@/utils/action_metrics_icons";

import IndicateursTableRowData from "@/components/IndicateursTable/IndicateursTableRowData.vue";
import IndicateursLabelSante from "@/components/IndicateursLabel/IndicateursLabelSante.vue";

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
});
const { data } = toRefs(props);
</script>
