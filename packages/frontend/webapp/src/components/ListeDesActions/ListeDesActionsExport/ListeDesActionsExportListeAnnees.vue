<template>
    <Select
        width="w-1/4"
        name="selected_year"
        label="Choisissez l'année"
        info="Sélectionnez l'année pour laquelle vous souhaitez exporter les actions"
        showMandatoryStar
    >
        <option v-for="year in years" :key="year" :value="year">
            {{ year }}
        </option>
    </Select>
</template>

<script setup>
import { toRefs, defineProps } from "vue";
import { Select } from "@resorptionbidonvilles/ui";

const props = defineProps({
    years: {
        type: Array,
        required: true,
    },
});
const { years } = toRefs(props);
</script>
