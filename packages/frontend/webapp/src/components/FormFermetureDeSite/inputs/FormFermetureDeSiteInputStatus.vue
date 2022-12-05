<template>
    <CheckableGroup id="status" :label="labels.status">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="status"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import items from "@/utils/closing_reasons";
import labels from "../FormFermetureDeSite.labels";
</script>
