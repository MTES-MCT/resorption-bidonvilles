<template>
    <CheckableGroup id="living_conditions_version" direction="horizontal">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="living_conditions_version"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";

const items = [
    { value: 2, label: "Oui" },
    { value: 1, label: "Non" },
];
</script>
