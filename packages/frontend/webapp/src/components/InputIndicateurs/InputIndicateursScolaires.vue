<template>
    <IndicateursGrid class="mt-12">
        <IndicateursRow>
            <template v-slot:right>
                <p class="px-4 pb-2">
                    <span class="font-bold"
                        >Année scolaire {{ year - 1 }} - {{ year }}</span
                    >
                </p>
            </template>
        </IndicateursRow>

        <IndicateursTableRowInputs
            :icon="icons.ecole"
            :data="data"
            :inputs="inputs.scolarisables"
        >
            <IndicateursLabelMineursScolarisables />
        </IndicateursTableRowInputs>
        <IndicateursTableRowInputs
            :data="data"
            :inputs="inputs.mediation"
            withoutTopBorder
        >
            <IndicateursLabelMineursEnMediation />
        </IndicateursTableRowInputs>
        <IndicateursTableRowInputs
            :data="data"
            :inputs="inputs.maternelle"
            withoutTopBorder
        >
            <IndicateursLabelMaternelle />
        </IndicateursTableRowInputs>
        <IndicateursTableRowInputs
            :data="data"
            :inputs="inputs.elementaire"
            withoutPadding
            withoutTopBorder
        >
            <IndicateursLabelElementaire />
        </IndicateursTableRowInputs>
        <IndicateursTableRowInputs
            :data="data"
            :inputs="inputs.college"
            withoutPadding
            withoutTopBorder
        >
            <IndicateursLabelCollege />
        </IndicateursTableRowInputs>
        <IndicateursTableRowInputs
            :data="data"
            :inputs="inputs.lycee"
            withoutPadding
            withoutTopBorder
        >
            <IndicateursLabelLycee />
        </IndicateursTableRowInputs>
        <IndicateursTableRowInputs
            :data="data"
            :inputs="inputs.autre"
            withoutPadding
            withoutTopBorder
        >
            <IndicateursLabelAutres />
        </IndicateursTableRowInputs>
    </IndicateursGrid>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import icons from "@/utils/action_metrics_icons";
import sections from "./sections.list";

import IndicateursRow from "@/components/IndicateursTable/IndicateursRow.vue";
import IndicateursTableRowInputs from "@/components/IndicateursTable/IndicateursTableRowInputs.vue";

import IndicateursGrid from "@/components/IndicateursGrid/IndicateursGrid.vue";
import IndicateursLabelAutres from "@/components/IndicateursLabel/IndicateursLabelAutres.vue";
import IndicateursLabelCollege from "@/components/IndicateursLabel/IndicateursLabelCollege.vue";
import IndicateursLabelElementaire from "@/components/IndicateursLabel/IndicateursLabelElementaire.vue";
import IndicateursLabelLycee from "@/components/IndicateursLabel/IndicateursLabelLycee.vue";
import IndicateursLabelMaternelle from "@/components/IndicateursLabel/IndicateursLabelMaternelle.vue";
import IndicateursLabelMineursEnMediation from "@/components/IndicateursLabel/IndicateursLabelMineursEnMediation.vue";
import IndicateursLabelMineursScolarisables from "@/components/IndicateursLabel/IndicateursLabelMineursScolarisables.vue";

const inputs = computed(() => {
    return sections.find(({ id }) => id === "ecole").inputs;
});
const props = defineProps({
    year: {
        type: Number,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
});
const { data, year } = toRefs(props);
</script>
