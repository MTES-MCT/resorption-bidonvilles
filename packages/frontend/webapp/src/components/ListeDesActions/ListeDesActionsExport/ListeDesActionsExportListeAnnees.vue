<template>
    <DsfrSelect
        select-id="selected_year_for_actions_export"
        name="selected_year"
        label="Choisissez l'année :"
        hint="Sélectionnez l'année pour laquelle vous souhaitez exporter les actions"
        required
        :modelValue="selectedYear"
        :options="years"
        @update:modelValue="handleYearSelected"
    />
</template>

<script setup>
defineProps({
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

function handleYearSelected(newYear) {
    // DsfrSelect émet la valeur lue sur le <select>, donc une chaîne.
    emit("year-selected", Number.parseInt(newYear, 10));
}
</script>
