<template>
    <IndicateursTableRowData
        :icon="icons.hebergement"
        :labels="['Personnes', 'Ménages']"
        :data="data"
    >
        <IndicateursLabelHebergement />
    </IndicateursTableRowData>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import icons from "@/utils/action_metrics_icons";

import IndicateursTableRowData from "@/components/IndicateursTable/IndicateursTableRowData.vue";
import IndicateursLabelHebergement from "@/components/IndicateursLabel/IndicateursLabelHebergement.vue";

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
});
const { data } = toRefs(props);
</script>
