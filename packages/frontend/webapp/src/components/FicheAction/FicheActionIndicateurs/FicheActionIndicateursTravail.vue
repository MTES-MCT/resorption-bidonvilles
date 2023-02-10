<template>
    <IndicateursTableRowData
        :icon="icons.travail"
        :labels="['Personnes', 'Femmes']"
        :data="data"
    >
        <IndicateursLabelTravail />
    </IndicateursTableRowData>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import icons from "@/utils/action_metrics_icons";

import IndicateursTableRowData from "@/components/IndicateursTable/IndicateursTableRowData.vue";
import IndicateursLabelTravail from "@/components/IndicateursLabel/IndicateursLabelTravail.vue";

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
});
const { data } = toRefs(props);
</script>
