<template>
    <CheckableGroup
        id="justice_rendered"
        direction="horizontal"
        :label="labels.justice_rendered"
        showMandatoryStar
    >
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="justice_rendered"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";
import items from "@/utils/yesNoItems";
</script>
