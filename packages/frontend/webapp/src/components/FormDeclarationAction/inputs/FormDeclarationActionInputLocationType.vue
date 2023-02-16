<template>
    <CheckableGroup id="location_type">
        <Radio
            v-for="item in items"
            :key="item.uid"
            :value="item.uid"
            :label="item.label"
            name="location_type"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import items from "@/utils/action_location_types";
</script>
