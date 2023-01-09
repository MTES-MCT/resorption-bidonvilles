<template>
    <InputDate :minDate="minDate" withoutMargin />
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";

import InputDate from "../inputs/FormMiseAJourIndicateursInputDate.vue";
const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);

const minDate = computed(() => {
    if (plan.value.states.length === 0) {
        return;
    }
    const d = new Date(plan.value.states.slice(-1)[0].date);
    d.setDate(d.getDate() + 1);
    return d;
});
</script>
