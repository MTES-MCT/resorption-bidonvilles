<template>
    <CheckableGroup
        id="is_reinstallation"
        :info="labels.is_reinstallation"
        direction="horizontal"
    >
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="is_reinstallation"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";
import items from "@/utils/yesNoItems";
</script>
