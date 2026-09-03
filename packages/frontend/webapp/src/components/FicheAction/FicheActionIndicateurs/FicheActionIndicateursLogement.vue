<template>
    <IndicateursTableRowData
        :labels="['Personnes', 'Ménages']"
        :data="data"
        withoutTopBorder
    >
        <IndicateursLabelLogement />
    </IndicateursTableRowData>
</template>

<script setup>
import { toRefs } from "vue";

import IndicateursTableRowData from "@/components/IndicateursTable/IndicateursTableRowData.vue";
import IndicateursLabelLogement from "@/components/IndicateursLabel/IndicateursLabelLogement.vue";

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
});
const { data } = toRefs(props);
</script>
