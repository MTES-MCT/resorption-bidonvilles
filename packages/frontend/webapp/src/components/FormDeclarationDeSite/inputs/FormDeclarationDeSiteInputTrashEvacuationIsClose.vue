<template>
    <CheckableGroup
        id="trash_evacuation_is_close"
        direction="horizontal"
        :label="labels.trash_evacuation_is_close"
        showMandatoryStar
    >
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="trash_evacuation_is_close"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import labels from "@/components/Common/FormEtFicheSite.labels";

const items = [
    { value: 1, label: "Oui" },
    { value: 0, label: "Non" },
    { value: -1, label: "Inconnu" },
];
</script>
