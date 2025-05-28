<template>
    <p class="text-xs text-center">
        {{ formatStat(figure.figure) }}
        <span v-if="figure.dateFrom"
            >du {{ figure.dateFrom }} au {{ figure.date }}</span
        >
        <span v-else>au {{ figure.date }}</span>
    </p>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import formatStat from "@common/utils/formatStat";

const props = defineProps({
    figure: {
        type: Object,
        required: true,
    },
});
const { figure } = toRefs(props);
</script>
