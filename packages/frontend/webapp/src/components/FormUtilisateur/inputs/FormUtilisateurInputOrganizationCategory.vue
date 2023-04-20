<template>
    <CheckableGroup id="organization_category" :label="label">
        <Radio
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            name="organization_category"
        />
    </CheckableGroup>
</template>

<script setup>
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import items from "@/utils/organization_categories.js";
import { toRefs } from "vue";

const props = defineProps({
    label: String,
});
const { label } = toRefs(props);
</script>
