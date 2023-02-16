<template>
    <IndicateursTableRowData
        :icon="icons.personnes"
        :labels="['Personnes', 'Ménages', 'Femmes', 'Mineurs']"
        :data="data"
    >
        <IndicateursLabelPersonnes />
    </IndicateursTableRowData>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import icons from "@/utils/action_metrics_icons";

import IndicateursTableRowData from "@/components/IndicateursTable/IndicateursTableRowData.vue";
import IndicateursLabelPersonnes from "@/components/IndicateursLabel/IndicateursLabelPersonnes.vue";

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
});
const { data } = toRefs(props);
</script>
