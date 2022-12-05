<template>
    <CheckableGroup direction="horizontal" id="water_access_type">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="water_access_type"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import waterAccessTypes from "@/utils/water_access_types";

const items = computed(() => {
    return Object.keys(waterAccessTypes).map((id) => ({
        value: id,
        label: waterAccessTypes[id],
    }));
});
</script>
