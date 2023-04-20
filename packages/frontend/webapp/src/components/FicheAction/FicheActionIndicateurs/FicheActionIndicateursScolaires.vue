<template>
    <IndicateursTableRowData
        :icon="icons.ecole"
        :labels="['']"
        :data="data.scolarisables"
    >
        <IndicateursLabelMineursScolarisables />
    </IndicateursTableRowData>

    <IndicateursTableRowData
        :labels="['']"
        :data="data.en_mediation"
        withoutTopBorder
    >
        <IndicateursLabelMineursEnMediation />
    </IndicateursTableRowData>

    <IndicateursTableRowData
        :labels="['']"
        :data="data.maternelle"
        withoutTopBorder
    >
        <IndicateursLabelMaternelle />
    </IndicateursTableRowData>

    <IndicateursTableRowData
        :labels="['']"
        :data="data.elementaire"
        withoutTopBorder
        withoutPadding
    >
        <IndicateursLabelElementaire />
    </IndicateursTableRowData>

    <IndicateursTableRowData
        :labels="['']"
        :data="data.college"
        withoutTopBorder
        withoutPadding
    >
        <IndicateursLabelCollege />
    </IndicateursTableRowData>

    <IndicateursTableRowData
        :labels="['']"
        :data="data.lycee"
        withoutTopBorder
        withoutPadding
    >
        <IndicateursLabelLycee />
    </IndicateursTableRowData>

    <IndicateursTableRowData
        :labels="['']"
        :data="data.autre"
        withoutTopBorder
        withoutPadding
    >
        <IndicateursLabelAutres />
    </IndicateursTableRowData>
</template>

<script setup>
import { toRefs } from "vue";
import icons from "@/utils/action_metrics_icons";

import IndicateursTableRowData from "@/components/IndicateursTable/IndicateursTableRowData.vue";
import IndicateursLabelMineursScolarisables from "@/components/IndicateursLabel/IndicateursLabelMineursScolarisables.vue";
import IndicateursLabelMineursEnMediation from "@/components/IndicateursLabel/IndicateursLabelMineursEnMediation.vue";
import IndicateursLabelMaternelle from "@/components/IndicateursLabel/IndicateursLabelMaternelle.vue";
import IndicateursLabelElementaire from "@/components/IndicateursLabel/IndicateursLabelElementaire.vue";
import IndicateursLabelCollege from "@/components/IndicateursLabel/IndicateursLabelCollege.vue";
import IndicateursLabelLycee from "@/components/IndicateursLabel/IndicateursLabelLycee.vue";
import IndicateursLabelAutres from "@/components/IndicateursLabel/IndicateursLabelAutres.vue";

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
});
const { data } = toRefs(props);
</script>
