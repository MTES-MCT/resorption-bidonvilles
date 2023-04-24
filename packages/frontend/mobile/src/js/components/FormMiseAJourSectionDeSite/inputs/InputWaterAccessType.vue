<template>
    <CheckableGroup direction="vertical" id="water_access_type">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            variant="radio"
            name="water_access_type"
            v-bind="$attrs"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed } from "vue";
import waterAccessTypes from "#frontend/common/utils/water_access_types";

import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";

const items = computed(() => {
    return Object.keys(waterAccessTypes).map((id) => ({
        value: id,
        label: waterAccessTypes[id],
    }));
});
</script>
