<template>
    <Select
        id="selected_year_for_actions_export"
        name="selected_year"
        label="Choisissez l'année"
        v-model="selectedYear"
        width="w-1/2 md:w-1/4"
        info="Sélectionnez l'année pour laquelle vous souhaitez exporter les actions"
        showMandatoryStar
        @change="handleYearSelected"
    >
        <option
            v-for="year in years"
            :key="year"
            :value="year"
            :selected="year === selectedYear"
        >
            {{ year }}
        </option>
    </Select>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { Select } from "@resorptionbidonvilles/ui";

const props = defineProps({
    years: {
        type: Array,
        required: true,
    },
    selectedYear: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(["year-selected"]);

const { years, selectedYear } = toRefs(props);

const handleYearSelected = (newYear) => {
    emit("year-selected", newYear.target.value);
};
</script>
