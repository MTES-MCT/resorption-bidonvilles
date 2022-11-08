<template>
    <CheckableGroup id="closing_reasons" :label="labels.closing_reasons">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="closing_reasons"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import items from "@/utils/closing_reasons";
import labels from "../FicheSiteModaleFermeture.labels";
</script>
