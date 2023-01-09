<template>
    <InputLabel :label="labels.difficultes" />
    <CheckableGroup :label="label" direction="row">
        <Checkbox
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            name="difficultes"
            :label="option.label"
        />
    </CheckableGroup>
</template>
<script setup>
import { ref } from "vue";

import labels from "../FormMiseAJourIndicateurs.labels";

import {
    InputLabel,
    CheckableGroup,
    Checkbox,
} from "@resorptionbidonvilles/ui";

const options = ref([
    { value: "cantine", label: "Cantine" },
    {
        value: "place_up2a",
        label: "Manque de place en UP2A",
    },
    { value: "transport", label: "Transport" },
]);
</script>
