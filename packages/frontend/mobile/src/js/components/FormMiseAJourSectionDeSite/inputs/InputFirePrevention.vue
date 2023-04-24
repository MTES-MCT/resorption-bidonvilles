<template>
    <CheckableGroup id="fire_prevention_diagnostic" direction="horizontal">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            variant="radio"
            name="fire_prevention_diagnostic"
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
