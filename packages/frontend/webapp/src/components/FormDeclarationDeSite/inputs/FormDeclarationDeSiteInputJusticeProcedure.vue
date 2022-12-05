<template>
    <CheckableGroup id="justice_procedure" direction="horizontal">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="justice_procedure"
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
