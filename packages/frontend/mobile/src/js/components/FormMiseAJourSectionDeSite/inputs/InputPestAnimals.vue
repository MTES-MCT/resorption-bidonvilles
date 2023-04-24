<template>
    <CheckableGroup id="pest_animals_presence" direction="horizontal">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            variant="radio"
            name="pest_animals_presence"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";

const items = [
    { value: 1, label: "Oui" },
    { value: 0, label: "Non" },
    { value: -1, label: "Inconnu" },
];
</script>
