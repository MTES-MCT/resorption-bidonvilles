<template>
    <CheckableGroup
        id="insalubrity_order_displayed"
        direction="horizontal"
        :label="labels.insalubrity_order_displayed"
    >
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="insalubrity_order_displayed"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";
import items from "@/utils/yesNoItems";
</script>
