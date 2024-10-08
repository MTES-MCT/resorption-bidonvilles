<template>
    <Select
        v-model="selectedYear"
        width="w-1/2 md:w-1/4"
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
import { defineProps, watch, toRefs, ref } from "vue";
import { Select } from "@resorptionbidonvilles/ui";

const props = defineProps({
    years: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(["year-selected"]);

const { years } = toRefs(props);
const selectedYear = ref(null);

watch(selectedYear, (newYear) => {
    emit("year-selected", newYear);
});
</script>
