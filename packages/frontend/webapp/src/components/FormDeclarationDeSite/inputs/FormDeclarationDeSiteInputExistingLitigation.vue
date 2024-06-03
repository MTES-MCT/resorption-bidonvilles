<template>
    <CheckableGroup
        id="existing_litigation"
        direction="horizontal"
        :label="labels.existing_litigation"
        showMandatoryStar
    >
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="existing_litigation"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import labels from "../FormDeclarationDeSite.labels";
import items from "@/utils/yesNoItems";
</script>
