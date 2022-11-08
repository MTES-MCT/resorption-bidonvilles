<template>
    <DatepickerInput
        name="date"
        :label="labels.date"
        :maxDate="new Date()"
        :clearable="false"
        v-bind="$attrs"
        v-model="date"
    />
</template>

<script setup>
import { ref } from "vue";
import labels from "../FicheSiteModaleFermeture.labels";
import { DatepickerInput } from "@resorptionbidonvilles/ui";

const date = ref(null);
</script>
