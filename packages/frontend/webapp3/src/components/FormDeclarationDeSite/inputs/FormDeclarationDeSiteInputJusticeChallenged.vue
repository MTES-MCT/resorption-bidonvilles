<template>
    <CheckableGroup id="justice_challenged" direction="horizontal" :label="labels.justice_challenged" showMandatoryStar>
        <Radio v-for="item in items" :key="item.value" :value="item.value" :label="item.label" name="justice_challenged"
            v-bind="$attrs" />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";

const items = [
    { value: 1, label: "Oui" },
    { value: 0, label: "Non" },
    { value: -1, label: "Inconnu" },
];
</script>
