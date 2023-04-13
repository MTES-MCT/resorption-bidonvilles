<template>
    <IndicateursTableRowInputs
        :inputs="logementInputs"
        :data="data"
        withoutTopBorder
    >
        <IndicateursLabelLogement />
    </IndicateursTableRowInputs>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import IndicateursTableRowInputs from "@/components/IndicateursTable/IndicateursTableRowInputs.vue";
import IndicateursLabelLogement from "@/components/IndicateursLabel/IndicateursLabelLogement.vue";
import sections from "./sections.list";

const logementInputs = computed(() => {
    return sections.find(({ id }) => id === "logement").inputs;
});
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});
const { data } = toRefs(props);
</script>
