<template>
    <CheckableGroup id="fire_prevention_diagnostic" direction="horizontal">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="fire_prevention_diagnostic"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import items from "@/utils/yesNoItems";
</script>
